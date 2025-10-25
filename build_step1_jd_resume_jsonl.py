#!/usr/bin/env python3
"""
Build Step 1: Parse (JD, Resume) pairs -> JSONL with evidence counts per competency.

- Input: CSV (default columns: jd, resume) or JSONL with keys jd,resume
- Output: JSONL rows with { jd, resume, evidence: {competency: {jd: int, resume: int}} }
- No external dependencies (stdlib only)

Usage examples:
  python build_step1_jd_resume_jsonl.py --input data/pairs.csv --output data/training/jd_resume.jsonl
  python build_step1_jd_resume_jsonl.py --input data/pairs.jsonl --jsonl --output data/training/jd_resume.jsonl

Tips:
- Adjust COMPETENCIES vocabulary below to match your domains.
- Set --min-competency 0 to keep competencies even if both counts are zero (debugging).
- Use --redact to mask emails/phones in the saved jd/resume text.
"""

from __future__ import annotations
import argparse
import csv
import json
import re
from collections import Counter
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

# -----------------------------
# 1) Competency Taxonomy (edit)
# -----------------------------
# Keys = competency names you will reuse everywhere (rubrics, QG, grading)
# Values = list of vocabulary tokens/phrases to detect in JD/Resume text
COMPETENCIES: Dict[str, List[str]] = {
    # DevOps & Delivery
    "CI/CD": [
        "ci/cd", "ci cd", "continuous integration", "continuous delivery", "continuous deployment",
        "jenkins", "github actions", "gitlab ci", "azure devops", "pipeline", "artifact", "sonarqube",
        "blue-green", "canary", "rollback", "roll back", "feature flag", "trunk-based",
    ],
    "Kubernetes": [
        "kubernetes", "k8s", "eks", "gke", "aks", "helm", "helm chart", "ingress", "service mesh",
        "istio", "linkerd", "daemonset", "statefulset", "hpa", "horizontal pod autoscaler", "namespace",
    ],
    "Containers": [
        "docker", "container", "containerd", "image", "dockerfile", "compose", "registry",
    ],

    # Cloud Providers
    "Cloud-AWS": [
        "aws", "ec2", "s3", "iam", "vpc", "alb", "nlb", "lambda", "api gateway", "cloudwatch",
        "cloudtrail", "rds", "aurora", "dynamodb", "efs", "eks", "sqs", "sns", "glue",
    ],
    "Cloud-Azure": [
        "azure", "vm scale set", "app service", "aks", "vnet", "azure ad", "cosmos db", "event hub",
        "functions", "monitor", "application insights",
    ],
    "Cloud-GCP": [
        "gcp", "compute engine", "gke", "cloud run", "cloud functions", "pub/sub", "bigquery", "vpc",
        "stackdriver",
    ],

    # Infra & Sec
    "Infra-as-Code": [
        "terraform", "hashicorp", "hcl", "cloudformation", "pulumi", "ansible", "packer", "bicep",
    ],
    "Security": [
        "least privilege", "oidc", "sso", "mfa", "kms", "key management", "kms key", "siem", "soc2",
        "pci dss", "hipaa", "owasp", "waf", "security group", "cspm", "iam policy",
    ],

    # Data & App
    "Databases": [
        "postgres", "mysql", "mariadb", "mongodb", "redis", "elasticsearch", "kafka", "zookeeper",
        "replication", "sharding", "partition", "indexing",
    ],
    "Python": [
        "python", "pandas", "fastapi", "flask", "pytest", "asyncio", "typing", "poetry", "pipenv",
    ],
    "Networking": [
        "subnet", "nat", "load balancer", "dns", "route 53", "tls", "certificate", "cidr", "ingress",
        "egress", "security group", "nacl",
    ],

    # ML/DL/AI/Data
    "Machine-Learning": [
        "machine learning", "ml", "sklearn", "scikit-learn", "supervised learning", "unsupervised learning",
        "regression", "classification", "clustering", "random forest", "svm", "decision tree", "xgboost",
        "lightgbm", "catboost", "model training", "feature engineering", "hyperparameter tuning",
    ],
    "Deep-Learning": [
        "deep learning", "dl", "neural network", "cnn", "rnn", "lstm", "gru", "transformer", "autoencoder",
        "gan", "vae", "dropout", "batch normalization", "pytorch", "tensorflow", "keras",
    ],
    "Artificial-Intelligence": [
        "artificial intelligence", "ai", "expert system", "reinforcement learning", "q-learning", "agent",
        "planning", "reasoning", "computer vision", "speech recognition", "robotics", "intelligent system",
    ],
    "NLP": [
        "nlp", "natural language processing", "bert", "gpt", "roberta", "t5", "huggingface", "tokenization",
        "transformer", "word2vec", "glove", "spacy", "nltk", "translation", "sentiment analysis",
        "text classification", "question answering", "named entity recognition",
    ],
    "GenAI": [
        "generative ai", "genai", "llm", "large language model", "gpt", "chatgpt", "mistral", "llama",
        "falcon", "rag", "prompt engineering", "fine-tuning", "in-context learning", "diffusion model",
        "stable diffusion", "image generation", "text-to-image", "text-to-speech",
    ],
    "Data-Science": [
        "data science", "data scientist", "eda", "exploratory data analysis", "feature selection",
        "model evaluation", "cross validation", "confusion matrix", "roc curve", "precision", "recall",
        "f1 score", "data wrangling", "data preprocessing", "statistical analysis", "hypothesis testing",
    ],
    "Data-Analysis": [
        "data analysis", "data analyst", "excel", "tableau", "power bi", "sql", "data visualization",
        "dashboard", "reporting", "business intelligence", "pivot table", "trend analysis", "kpi",
        "descriptive statistics", "correlation", "regression analysis",
    ],
}


# -----------------------------------------
# 2) Redaction helpers (PII hygiene optional)
# -----------------------------------------
EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(?<!\d)(?:\+?\d{1,3}[\s-]?)?(?:\d{3}[\s-]?){2}\d{4}(?!\d)")


def redact(text: str) -> str:
    text = EMAIL_RE.sub("<redacted_email>", text)
    text = PHONE_RE.sub("<redacted_phone>", text)
    return text

# --------------------------------------------------
# 3) Tokenization & vocabulary matching (regex-based)
# --------------------------------------------------

def normalize(text: str) -> str:
    # Lowercase and collapse whitespace; keep symbols useful for tech terms
    text = text.lower().replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def compile_vocab_patterns(vocab: List[str]) -> List[re.Pattern]:
    pats: List[re.Pattern] = []
    for term in vocab:
        term = term.lower().strip()
        # Word boundary for alnum tokens; permissive for tokens like "ci/cd", "k8s", "ec2"
        if re.search(r"[a-z0-9]", term):
            # Allow optional plural 's' for basic nouns, and optional dashes/spaces
            escaped = re.escape(term)
            # Examples: "feature flag" → match "feature flag" or "feature-flag"
            escaped = escaped.replace("\\ ", r"[\s-]")
            pattern = rf"(?<![a-z0-9]){escaped}(?![a-z0-9])"
        else:
            pattern = re.escape(term)
        pats.append(re.compile(pattern))
    return pats

# Pre-compile for speed
COMP_PATTERNS: Dict[str, List[re.Pattern]] = {
    comp: compile_vocab_patterns(vocab) for comp, vocab in COMPETENCIES.items()
}


def count_hits(text: str, patterns: List[re.Pattern]) -> int:
    return sum(len(p.findall(text)) for p in patterns)


# ----------------------------------------------------------
# 4) Evidence builder: per-competency counts for JD & Resume
# ----------------------------------------------------------

def map_to_evidence(jd_text: str, resume_text: str) -> Dict[str, Dict[str, int]]:
    jd_norm = normalize(jd_text)
    cv_norm = normalize(resume_text)
    evidence: Dict[str, Dict[str, int]] = {}
    for comp, pats in COMP_PATTERNS.items():
        evidence[comp] = {
            "jd": count_hits(jd_norm, pats),
            "resume": count_hits(cv_norm, pats),
        }
    return evidence


def build_row(jd_text: str, resume_text: str, *, redact_pii: bool = False) -> Dict:
    if redact_pii:
        jd_text = redact(jd_text)
        resume_text = redact(resume_text)
    return {
        "jd": jd_text.strip(),
        "resume": resume_text.strip(),
        "evidence": map_to_evidence(jd_text, resume_text),
    }


# -------------------------------------------
# 5) Readers for CSV and JSONL input sources
# -------------------------------------------

def read_pairs_csv(path: Path, jd_col: str, resume_col: str) -> Iterable[Tuple[str, str]]:
    with path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, 1):
            jd = row.get(jd_col, "").strip()
            cv = row.get(resume_col, "").strip()
            if not jd or not cv:
                continue
            yield jd, cv


def read_pairs_jsonl(path: Path, jd_key: str = "jd", resume_key: str = "resume") -> Iterable[Tuple[str, str]]:
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            obj = json.loads(line)
            jd = str(obj.get(jd_key, "")).strip()
            cv = str(obj.get(resume_key, "")).strip()
            if not jd or not cv:
                continue
            yield jd, cv


# ---------------------
# 6) CLI & Main routine
# ---------------------

def main():
    ap = argparse.ArgumentParser(description="Build JSONL with JD/Resume evidence counts")
    ap.add_argument("--input", required=True, help="Path to CSV or JSONL with JD/Resume pairs")
    ap.add_argument("--output", required=True, help="Path to write JSONL output")
    ap.add_argument("--jsonl", action="store_true", help="Set if input is JSONL (default CSV)")
    ap.add_argument("--jd-col", default="jd", help="CSV column name for job description")
    ap.add_argument("--resume-col", default="resume", help="CSV column name for resume")
    ap.add_argument("--redact", action="store_true", help="Redact emails/phones in saved text")
    ap.add_argument("--min-competency", type=int, default=1,
                    help="Drop competencies where both jd and resume counts < this threshold")

    args = ap.parse_args()

    in_path = Path(args.input)
    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if args.jsonl:
        pairs = read_pairs_jsonl(in_path)
    else:
        pairs = read_pairs_csv(in_path, jd_col=args.jd_col, resume_col=args.resume_col)

    kept = 0
    total = 0
    with out_path.open("w", encoding="utf-8") as out:
        for jd_text, resume_text in pairs:
            total += 1
            row = build_row(jd_text, resume_text, redact_pii=args.redact)
            # Optionally prune low-signal competencies to keep files compact
            if args.min_competency > 0:
                ev = row["evidence"]
                pruned = {k:v for k,v in ev.items() if (v["jd"] + v["resume"]) >= args.min_competency}
                row["evidence"] = pruned or ev  # keep original if all got pruned
            out.write(json.dumps(row, ensure_ascii=False) + "\n")
            kept += 1

    print(f"Processed {total} pairs → wrote {kept} JSONL rows to {out_path}")


if __name__ == "__main__":
    main()
