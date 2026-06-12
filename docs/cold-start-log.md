# Cold-start log

## 2025-MM-DD (after Module 03)

Ran the cold-start test. Q1, Q2, Q3 answered fully from files. Q4 and Q5
have placeholders pending Module 05 (`PROGRESS.md`) and Module 08
(`feature_list.json`).

Knowledge visibility gap (5 questions, 2 placeholders): 40%. Target by end
of Module 08: 0%.

## 2025-MM-DD (after Module 04)

Reproduced lost-in-the-middle: bloated AGENTS.md placed the citation rule
in the middle, agent missed it. Split into routing + topic docs, agent
followed the rule. Citation rule is now duplicated at the top and bottom
of `AGENTS.md`; full text in `docs/citation-rule.md`.

## 2025-MM-DD (after Module 05)

Rebuild cost: ~90 seconds from terminal-open to identifying next action.
Knowledge visibility gap (5 questions): Q1–Q4 fully sourced; Q5 still
points at "Module 08 will add `feature_list.json`." Gap = 20%.

## 2025-MM-DD (after Module 08)

Knowledge visibility gap closed. All five cold-start questions answer
from files: PROGRESS.md (Q4) and feature_list.json (Q5). Gap = 0%.