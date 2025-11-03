#!/usr/bin/env python3
"""
LangChain-based Interactive Interview System (THEORY-ONLY questions)

Systematic implementation using LangChain for:
- Structured prompt templates
- Chain-based workflow management
- Output parsing with validation
- Memory management for interview context

Flow:
1) Pick top-weight competency from rubrics_filled.jsonl
2) Generate theoretical question using LangChain chains
3) Grade answer with rubric-based evaluation chain
4) Generate follow-up questions dynamically
5) Store results in structured format

Usage:
  python new_llm_inter.py \
    --input data/training/rubrics_filled.jsonl \
    --sample-idx 1 \
    --outfile data/training/evals.jsonl \
    --rounds 3

Requires:
- pip install langchain langchain-openai python-dotenv
- .env with LLM_API_KEY, LLM_BASE_URL, LLM_MODEL
"""

from __future__ import annotations
import argparse
import json
import os
import pathlib
import re
import sys
from typing import Any, Dict, List, Optional, Tuple

from dotenv import load_dotenv
from pydantic import BaseModel, Field, validator

load_dotenv()

try:
    from langchain_openai import ChatOpenAI
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import PydanticOutputParser
    from langchain_core.exceptions import OutputParserException
except ImportError as e:
    print(f"Missing dependencies: {e}")
    print("Install: pip install langchain langchain-openai python-dotenv pydantic")
    sys.exit(1)


# ============================================================================
# Pydantic Models for Structured Outputs
# ============================================================================

class QuestionOutput(BaseModel):
    """Schema for generated interview questions"""
    question: str = Field(description="The interview question, must end with '?'")
    difficulty: str = Field(description="Difficulty level: L1, L2, L3, or L4")
    competency: str = Field(description="Target competency being evaluated")
    rationale: str = Field(
        description="Brief rationale for the question (max 60 chars)",
        max_length=60
    )

    @validator("question")
    def validate_question(cls, v):
        if not v.strip().endswith("?"):
            raise ValueError("Question must end with '?'")
        if len(v.split()) > 15:
            raise ValueError("Question must be 15 words or less")
        return v.strip()

    @validator("difficulty")
    def validate_difficulty(cls, v):
        if v not in ["L1", "L2", "L3", "L4"]:
            raise ValueError("Difficulty must be L1, L2, L3, or L4")
        return v


class GradeOutput(BaseModel):
    """Schema for answer grading"""
    score: float = Field(description="Score between 0.0 and 1.0", ge=0.0, le=1.0)
    justification: str = Field(
        description="Justification referencing rubric indicators (max 40 words)",
        max_length=250
    )
    followup_question: str = Field(
        description="Follow-up question based on the answer"
    )

    @validator("followup_question")
    def validate_followup(cls, v):
        if v and not v.strip().endswith("?"):
            return v.strip() + "?"
        return v.strip()


class RewrittenQuestion(BaseModel):
    """Schema for rewritten follow-up questions"""
    question: str = Field(description="Rewritten theoretical question")


# ============================================================================
# Validation Functions
# ============================================================================

# Imperative/code-y verbs or tokens to avoid
IMP_VERBS = re.compile(
    r"\b(write|implement|code|create|build|design|develop|draft|show|provide|give)\b",
    re.I
)
CODE_TOKENS = re.compile(
    r"```|\bdef\b|\bclass\b|\bimport\b|<code>|console\.log|;\s*$|\{\s*\}|\(|\)\s*:\s*$",
    re.I
)
JOINERS = re.compile(r"\b(and|or)\b", re.I)


def validate_theory_question(q: str) -> Tuple[bool, str]:
    """Validate that a question is theoretical and well-formed"""
    if not isinstance(q, str) or not q.strip():
        return False, "Empty question"

    q = q.strip()

    if not q.endswith("?"):
        return False, "Must end with '?'"

    if len(q.split()) > 15:
        return False, "Too long (>15 words)"

    if IMP_VERBS.search(q) and ("code" in q.lower() or "implement" in q.lower()):
        return False, "Asks for code/implementation"

    if re.search(r"(write|provide|show|paste).*(code|snippet|function)", q, re.I):
        return False, "Requests code/snippet"

    if CODE_TOKENS.search(q):
        return False, "Looks like code"

    if q.count("?") > 1:
        return False, "Multiple questions"

    if JOINERS.search(q):
        return False, "Likely multi-part"

    return True, ""


def band_from_score(score: float) -> str:
    """Convert numeric score to band level - generous bands"""
    if score < 0.40:
        return "L1"
    elif score < 0.60:
        return "L2"
    elif score < 0.80:
        return "L3"
    else:
        return "L4"


# ============================================================================
# LangChain Chain Builders
# ============================================================================

class InterviewChainManager:
    """Manages LangChain chains for the interview process"""

    def __init__(self, model_name: str, api_key: str, base_url: Optional[str] = None):
        """Initialize the chain manager with LLM configuration"""
        self.model_name = model_name
        self.api_key = api_key
        self.base_url = base_url

        # Initialize LLMs with different temperatures for different tasks
        self.question_llm = self._create_llm(temperature=0.2)
        self.grader_llm = self._create_llm(temperature=0.3)  # Higher temp for more lenient grading
        self.rewrite_llm = self._create_llm(temperature=0.2)

        # Build chains
        self.question_chain = self._build_question_chain()
        self.grader_chain = self._build_grader_chain()
        self.rewrite_chain = self._build_rewrite_chain()

    def _create_llm(self, temperature: float) -> ChatOpenAI:
        """Create a ChatOpenAI instance with specified temperature"""
        kwargs = {
            "model": self.model_name,
            "temperature": temperature,
            "api_key": self.api_key,
        }
        if self.base_url:
            kwargs["base_url"] = self.base_url

        return ChatOpenAI(**kwargs)

    def _build_question_chain(self):
        """Build the question generation chain"""
        parser = PydanticOutputParser(pydantic_object=QuestionOutput)

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You write concise, single-claim interview questions aligned to the JD+resume.

CRITICAL: Produce **theoretical** questions only — NO requests to write/implement/show code or snippets.
Ask about concepts, function semantics, API choices, trade-offs, risks, or best practices.
One question only, ≤15 words, ends with '?'.

{format_instructions}"""),
            ("human", """JD:
{jd}

Resume:
{resume}

Target competency: {competency}

Generate a theoretical interview question that evaluates this competency.""")
        ])

        prompt = prompt.partial(format_instructions=parser.get_format_instructions())

        # Use LCEL (pipe operator) instead of deprecated LLMChain
        return prompt | self.question_llm | parser

    def _build_grader_chain(self):
        """Build the answer grading chain"""
        parser = PydanticOutputParser(pydantic_object=GradeOutput)

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a fair and encouraging grader. Use the rubric as a guide, but be lenient and supportive.

GRADING PHILOSOPHY:
- Give credit for partial knowledge and reasonable attempts
- Value conceptual understanding over perfect terminology
- If the answer shows any relevant knowledge, start from 0.5 minimum
- Reward effort and logical thinking
- Focus on what the candidate GOT RIGHT, not just what's missing
- Be generous with scores - if unsure between two scores, choose the higher one

SCORING GUIDELINES:
- 0.7-1.0: Answer shows good understanding (even if incomplete)
- 0.5-0.7: Answer shows basic understanding or partial knowledge
- 0.3-0.5: Answer shows some relevant awareness
- 0.0-0.3: Answer is mostly off-topic or incorrect

In justification, mention what the candidate did well first, then areas for improvement.
Your followup_question MUST be theoretical (no code requests).
Examples: 'Which module would you choose for X?', 'What does function Y do?', 'How do you evaluate A vs B?'
Limits: ≤15 words, single claim, ends with '?'.

{format_instructions}"""),
            ("human", """Rubric fragment (one competency):
{competency_rubric}

Question asked: {question}

Candidate answer:
{answer}

Grade the answer fairly and generously. Focus on what they understood correctly.""")
        ])

        prompt = prompt.partial(format_instructions=parser.get_format_instructions())

        # Use LCEL (pipe operator) instead of deprecated LLMChain
        return prompt | self.grader_llm | parser

    def _build_rewrite_chain(self):
        """Build the follow-up question rewrite chain"""
        parser = PydanticOutputParser(pydantic_object=RewrittenQuestion)

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You rewrite follow-up questions into concise, theoretical, single-claim questions.

Never ask to write/implement/show code or snippets.
Focus on concepts, function semantics, API choices, trade-offs, risks, or best practices.
Constraints: ≤15 words, one question, ends with '?'.

{format_instructions}"""),
            ("human", """Original follow-up: {original_question}

Rewrite into a theoretical, single-claim question (≤15 words).""")
        ])

        prompt = prompt.partial(format_instructions=parser.get_format_instructions())

        # Use LCEL (pipe operator) instead of deprecated LLMChain
        return prompt | self.rewrite_llm | parser

    def generate_question(
        self,
        jd: str,
        resume: str,
        competency: str,
        max_retries: int = 3
    ) -> QuestionOutput:
        """Generate a theoretical interview question with validation retries"""
        for attempt in range(max_retries):
            try:
                # LCEL chains return the parsed output directly
                output = self.question_chain.invoke({
                    "jd": jd[:800],
                    "resume": resume[:800],
                    "competency": competency,
                })

                # Validate theory constraints
                is_valid, reason = validate_theory_question(output.question)
                if is_valid:
                    return output

                print(f"  Retry {attempt + 1}: {reason}")

            except (OutputParserException, ValueError) as e:
                print(f"  Parse error on attempt {attempt + 1}: {e}")

        # Fallback question if all retries fail
        return QuestionOutput(
            question=f"What are the key considerations for {competency}?",
            difficulty="L2",
            competency=competency,
            rationale="Fallback question"
        )

    def grade_answer(
        self,
        question: str,
        answer: str,
        competency_rubric: Dict[str, Any]
    ) -> GradeOutput:
        """Grade an answer against the rubric"""
        try:
            # LCEL chains return the parsed output directly
            output = self.grader_chain.invoke({
                "question": question,
                "answer": answer,
                "competency_rubric": json.dumps(competency_rubric, ensure_ascii=False),
            })

            return output

        except (OutputParserException, ValueError) as e:
            print(f"  Grading error: {e}")
            # Fallback grading
            return GradeOutput(
                score=0.5,
                justification="Unable to parse grading response",
                followup_question="Could you elaborate on your answer?"
            )

    def rewrite_followup(self, original_question: str) -> str:
        """Rewrite a follow-up question to ensure it's theoretical"""
        is_valid, _ = validate_theory_question(original_question)
        if is_valid:
            return original_question

        try:
            # LCEL chains return the parsed output directly
            output = self.rewrite_chain.invoke({
                "original_question": original_question,
            })

            rewritten = output.question

            # Validate the rewritten question
            is_valid, _ = validate_theory_question(rewritten)
            if is_valid:
                return rewritten

        except (OutputParserException, ValueError) as e:
            print(f"  Rewrite error: {e}")

        # Ultimate fallback
        return "Could you explain the key concepts behind your approach?"


# ============================================================================
# I/O Helpers
# ============================================================================

def append_record(path: pathlib.Path, record: Dict[str, Any]) -> None:
    """Append a JSON record to the output file"""
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def load_sample(input_path: str, sample_idx: int) -> Dict[str, Any]:
    """Load a specific sample from the input JSONL file"""
    lines = pathlib.Path(input_path).read_text(encoding="utf-8").splitlines()
    if sample_idx >= len(lines):
        raise IndexError(
            f"Sample index {sample_idx} out of range. "
            f"File has {len(lines)} sample(s). Valid indices: 0 to {len(lines) - 1}"
        )
    return json.loads(lines[sample_idx])


def select_competency(
    rubric: Dict[str, Any],
    competency_name: Optional[str] = None
) -> Dict[str, Any]:
    """Select a competency from the rubric"""
    competencies = rubric.get("competencies", [])
    if not competencies:
        raise ValueError("No competencies found in the rubric")

    if competency_name:
        comp = next(
            (c for c in competencies if c.get("name", "").lower() == competency_name.lower()),
            None
        )
        if not comp:
            raise ValueError(f"Competency '{competency_name}' not found in rubric")
        return comp
    else:
        # Select competency with highest weight
        return max(competencies, key=lambda c: c.get("weight", 0.0))


# ============================================================================
# Main Interview Flow
# ============================================================================

class InterviewSession:
    """Manages an interactive interview session"""

    def __init__(
        self,
        chain_manager: InterviewChainManager,
        jd: str,
        resume: str,
        competency: Dict[str, Any],
        output_path: pathlib.Path,
    ):
        self.chain_manager = chain_manager
        self.jd = jd
        self.resume = resume
        self.competency = competency
        self.output_path = output_path
        self.competency_name = competency.get("name", "Unknown")

    def run(self, rounds: int) -> None:
        """Run the interview for the specified number of rounds"""
        print(f"\n=== Competency: {self.competency_name} (theory-only) ===")

        # Generate initial question
        q_output = self.chain_manager.generate_question(
            self.jd,
            self.resume,
            self.competency_name
        )
        current_question = q_output.question

        for round_num in range(rounds):
            if not current_question:
                print("No question available, stopping.")
                break

            print(f"\nQ{round_num + 1}: {current_question}")
            print("(Type your answer; 'quit' to stop)\n> ", end="")

            try:
                answer = input().strip()
            except KeyboardInterrupt:
                print("\nInterrupted.")
                break

            if not answer or answer.lower() in {"quit", "exit", ":q"}:
                print("Stopping.")
                break

            # Grade the answer
            grade_output = self.chain_manager.grade_answer(
                current_question,
                answer,
                self.competency
            )

            # Rewrite follow-up if needed
            followup = self.chain_manager.rewrite_followup(
                grade_output.followup_question
            )

            # Calculate band
            band = band_from_score(grade_output.score)

            # Display results
            print(f"→ Score: {grade_output.score:.2f}  Band: {band}")
            print(f"→ Why: {grade_output.justification}")
            print(f"→ Follow-up: {followup}")

            # Store record
            record = {
                "round": round_num + 1,
                "competency": self.competency_name,
                "question": current_question,
                "answer": answer,
                "score": grade_output.score,
                "band": band,
                "justification": grade_output.justification,
                "followup_question": followup,
            }
            append_record(self.output_path, record)

            # Next question is the follow-up
            current_question = followup

        print(f"\nSaved records to: {self.output_path}")


# ============================================================================
# CLI Entry Point
# ============================================================================

def main():
    """Main entry point for the Interview System"""
    parser = argparse.ArgumentParser(
        description="LangChain-based Interactive Interview (theory-only)"
    )
    parser.add_argument(
        "--input",
        default="data/training/rubrics_filled.jsonl",
        help="Path to rubrics_filled.jsonl"
    )
    parser.add_argument(
        "--sample-idx",
        type=int,
        default=0,
        help="Which JD+resume pair to use (line number)"
    )
    parser.add_argument(
        "--competency",
        default=None,
        help="Force a specific competency (else uses top-weight)"
    )
    parser.add_argument(
        "--outfile",
        default="data/training/evals.jsonl",
        help="Where to append evaluation results"
    )
    parser.add_argument(
        "--rounds",
        type=int,
        default=3,
        help="Total questions to ask (initial + follow-ups)"
    )
    parser.add_argument(
        "--model",
        default=os.getenv("LLM_MODEL", "llama-3.3-70b-versatile"),
        help="LLM model name"
    )
    parser.add_argument(
        "--base-url",
        default=os.getenv("LLM_BASE_URL", None),
        help="LLM API base URL"
    )
    parser.add_argument(
        "--api-key",
        default=os.getenv("LLM_API_KEY", None),
        help="LLM API key"
    )

    args = parser.parse_args()

    if not args.api_key:
        print("Error: LLM_API_KEY not found in environment or arguments")
        sys.exit(1)

    try:
        # Load sample data
        sample = load_sample(args.input, args.sample_idx)

        # Select competency
        competency = select_competency(
            sample.get("rubric", {}),
            args.competency
        )

        # Initialize chain manager
        chain_manager = InterviewChainManager(
            model_name=args.model,
            api_key=args.api_key,
            base_url=args.base_url,
        )

        # Run interview session
        session = InterviewSession(
            chain_manager=chain_manager,
            jd=sample.get("jd", ""),
            resume=sample.get("resume", ""),
            competency=competency,
            output_path=pathlib.Path(args.outfile),
        )

        session.run(rounds=args.rounds)

    except FileNotFoundError:
        print(f"Error: Input file '{args.input}' not found")
        sys.exit(1)
    except IndexError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
