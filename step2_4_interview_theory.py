#!/usr/bin/env python3
"""
Interactive interview (THEORY-ONLY questions)

Flow:
1) Pick top-weight competency from rubrics_filled.jsonl (or --competency).
2) Generate ONE concise, **theoretical** question (no "implement/write code").
3) Read your answer, grade strictly against the rubric, and store a JSON record:
   {question, answer, score, justification, followup_question}
4) Ask the **follow-up** (also **theory-only**). Repeat for --rounds.

Usage (Windows PowerShell example):
  python step2_4_interview_theory.py \
    --input data/training/rubrics_filled.jsonl \
    --sample-idx 1 \
    --outfile data/training/evals.jsonl \
    --rounds 3

Requires:
- .env with LLM_API_KEY, LLM_BASE_URL, LLM_MODEL (or pass flags)
"""

from __future__ import annotations
import argparse, json, os, pathlib, re, sys
from typing import Any, Tuple
from dotenv import load_dotenv
load_dotenv()

try:
    from openai import OpenAI
except Exception:
    OpenAI = None

# ---------------- Utils -----------------

def parse_json_str(s: str) -> dict:
    try:
        return json.loads(s)
    except Exception:
        t = s.strip()
        if t.startswith("```json"): t = t[len("```json"):]
        if t.startswith("```"): t = t[len("```"):]
        if t.endswith("```"): t = t[:-3]
        t = t.strip().strip("`")
        t = t.replace(",}\n", "}\n").replace(",}", "}").replace(",]", "]")
        return json.loads(t)

# Imperative/code-y verbs or tokens we want to avoid
IMP_VERBS = re.compile(r"\b(write|implement|code|create|build|design|develop|draft|show|provide|give)\b", re.I)
CODE_TOKENS = re.compile(r"```|\bdef\b|\bclass\b|\bimport\b|<code>|console\.log|;\s*$|\{\s*\}|\(|\)\s*:\s*$", re.I)
JOINERS   = re.compile(r"\b(and|or)\b", re.I)


def validate_theory_question(q: str) -> Tuple[bool, str]:
    if not isinstance(q, str) or not q.strip():
        return False, "Empty question"
    q = q.strip()
    if not q.endswith("?"): return False, "Must end with '?'"
    if len(q.split()) > 15: return False, "Too long (>15 words)"
    if IMP_VERBS.search(q) and ("code" in q.lower() or "implement" in q.lower()):
        return False, "Asks for code/implementation"
    # Disallow explicit requests for code/snippets
    if re.search(r"(write|provide|show|paste).*(code|snippet|function)", q, re.I):
        return False, "Requests code/snippet"
    if CODE_TOKENS.search(q):
        return False, "Looks like code"
    if q.count("?") > 1: return False, "Multiple questions"
    if JOINERS.search(q): return False, "Likely multi-part"
    return True, ""


def band_from_score(score: float) -> str:
    if score <= 0.25: return "L1"
    if score <= 0.50: return "L2"
    if score <= 0.75: return "L3"
    return "L4"

# ---------------- Prompts -----------------

QG_SYSTEM = (
    "You write concise, single-claim interview questions aligned to the JD+resume.\n"
    "CRITICAL: Produce **theoretical** questions only — NO requests to write/implement/show code or snippets.\n"
    "Ask about concepts, function semantics, API choices, trade-offs, risks, or best practices.\n"
    "One question only, ≤15 words, ends with '?'. Output JSON ONLY with keys: question, difficulty(L1..L4), competency, rationale(≤60 chars)."
)

GRADER_SYSTEM = (
    "You are a strict grader. Obey the rubric exactly. Output JSON only. No chain of thought.\n"
    "Schema: {score(0..1), justification(<=40 words), followup_question}. Do NOT include a 'band' field.\n"
    "In justification, reference at least TWO rubric indicators (short phrases).\n"
    "Your followup_question MUST be theoretical (no code requests). Examples: 'Which module would you choose for X?', 'What does function Y do?', 'How do you evaluate A vs B?'\n"
    "Limits: ≤15 words, single claim, ends with '?'."
)

FOLLOWUP_REWRITE_SYSTEM = (
    "You rewrite follow-up questions into concise, theoretical, single-claim questions.\n"
    "Never ask to write/implement/show code or snippets.\n"
    "Focus on concepts, function semantics, API choices, trade-offs, risks, or best practices.\n"
    "Constraints: ≤15 words, one question, ends with '?'.\n"
    "Output JSON ONLY: {question}."
)

# ---------------- LLM helpers -----------------

def gen_question(client: Any, model: str, jd: str, resume: str, comp_name: str) -> dict:
    user = (
        f"JD:\n{jd[:800]}\n\nResume:\n{resume[:800]}\n\n"
        f"Target competency: {comp_name}.\n"
        "Return JSON with keys: question, difficulty(L1‑L4), competency, rationale(≤60 chars)."
    )
    tries = 0
    while True:
        resp = client.chat.completions.create(
            model=model,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[{"role": "system", "content": QG_SYSTEM}, {"role": "user", "content": user}],
        )
        obj = parse_json_str(resp.choices[0].message.content)
        obj["competency"] = comp_name
        ok, why = validate_theory_question(obj.get("question", ""))
        if ok or tries >= 2:
            return obj
        tries += 1
        user += f"\n\nRegenerate; fix issue: {why}. Keep ≤15 words. Theoretical only (no code)."

def grade_once(client: Any, model: str, comp: dict, answer: str) -> dict:
    user = (
        f"Rubric fragment (one competency):\n{json.dumps(comp, ensure_ascii=False)}\n\n"
        f"Candidate answer:\n{answer}\n\n"
        "Return JSON: {score(0..1), justification(<=40w), followup_question}"
    )
    resp = client.chat.completions.create(
        model=model,
        temperature=0.05,
        response_format={"type": "json_object"},
        messages=[{"role": "system", "content": GRADER_SYSTEM}, {"role": "user", "content": user}],
    )
    obj = parse_json_str(resp.choices[0].message.content)
    try:
        score = float(obj.get("score", 0))
    except Exception:
        score = 0.0
    score = 0.0 if score < 0 else (1.0 if score > 1 else score)
    follow = str(obj.get("followup_question", "")).strip()
    return {
        "score": score,
        "band": band_from_score(score),
        "justification": str(obj.get("justification", "")).strip(),
        "followup_question": follow,
    }


def rewrite_followup_if_needed(client: Any, model: str, q: str) -> str:
    ok, why = validate_theory_question(q)
    if ok:
        return q
    # Ask LLM to rewrite into theory-only
    user = f"Original follow-up: {q}\nRewrite into a theoretical, single-claim question (≤15 words)."
    resp = client.chat.completions.create(
        model=model,
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[{"role": "system", "content": FOLLOWUP_REWRITE_SYSTEM}, {"role": "user", "content": user}],
    )
    obj = parse_json_str(resp.choices[0].message.content)
    new_q = str(obj.get("question", "")).strip()
    ok2, _ = validate_theory_question(new_q)
    return new_q if ok2 else "Could you explain the key concepts behind your approach?"

# ---------------- I/O helpers -----------------

def append_record(path: pathlib.Path, record: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

# ---------------- Main flow -----------------

def main():
    ap = argparse.ArgumentParser(description="Interactive interview (theory-only): ask, grade, store, follow-up.")
    ap.add_argument("--input", default="data/training/rubrics_filled.jsonl", help="rubrics_filled.jsonl")
    ap.add_argument("--sample-idx", type=int, default=0, help="which JD+resume pair (line number)")
    ap.add_argument("--competency", default=None, help="force a competency (else top-weight)")
    ap.add_argument("--outfile", default="data/training/evals.jsonl", help="where to append results")
    ap.add_argument("--rounds", type=int, default=3, help="total questions to ask (initial + follow-ups)")
    ap.add_argument("--model", default=os.getenv("LLM_MODEL", "llama-3.3-70b-versatile"))
    ap.add_argument("--base-url", default=os.getenv("LLM_BASE_URL", None))
    ap.add_argument("--api-key", default=os.getenv("LLM_API_KEY", None))
    args = ap.parse_args()

    if OpenAI is None:
        print("Please: pip install openai python-dotenv"); sys.exit(1)

    client = OpenAI(api_key=args.api_key, base_url=args.base_url) if args.base_url else OpenAI(api_key=args.api_key)

    # Load row + choose competency
    lines = pathlib.Path(args.input).read_text(encoding="utf-8").splitlines()
    row = json.loads(lines[args.sample_idx])
    rubric = row["rubric"]; comps = rubric.get("competencies", [])
    if not comps:
        print("No competencies found in this sample."); sys.exit(1)

    if args.competency:
        comp = next((c for c in comps if c.get("name","").lower()==args.competency.lower()), None)
        if not comp:
            print(f"Competency '{args.competency}' not in this sample."); sys.exit(1)
        comp_name = comp["name"]
    else:
        comp = max(comps, key=lambda c: c.get("weight", 0.0))
        comp_name = comp["name"]

    jd = row.get("jd", ""); resume = row.get("resume", "")

    # Initial question via QG (theory-only)
    q_obj = gen_question(client, args.model, jd, resume, comp_name)
    question = q_obj.get("question", "")

    print(f"\n=== Competency: {comp_name} (theory-only) ===")
    for i in range(args.rounds):
        if not question:
            print("No question available, stopping.")
            break
        print(f"\nQ{i+1}: {question}")
        print("(Type your answer; 'quit' to stop)\n> ", end="")
        try:
            answer = input().strip()
        except KeyboardInterrupt:
            print("\nInterrupted.")
            break
        if not answer or answer.lower() in {"quit", "exit", ":q"}:
            print("Stopping.")
            break

        graded = grade_once(client, args.model, comp, answer)
        # Rewrite follow-up into theory-only if needed
        follow = rewrite_followup_if_needed(client, args.model, graded.get("followup_question", ""))

        print(f"→ Score: {graded['score']:.2f}  Band: {graded['band']}\n→ Why: {graded['justification']}\n→ Follow-up: {follow}")

        # Store minimal record
        record = {
            "question": question,
            "answer": answer,
            "score": graded["score"],
            "justification": graded["justification"],
            "followup_question": follow,
        }
        append_record(pathlib.Path(args.outfile), record)

        # Next question becomes sanitized follow-up
        question = follow
        if question and not question.strip().endswith('?'):
            question = question.strip() + '?'

    print(f"\nSaved records to: {args.outfile}")

if __name__ == "__main__":
    main()
