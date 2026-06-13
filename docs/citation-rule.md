# Citation Rule

Every single line of `noted ask` console output that names or refers to a specific note MUST explicitly include the absolute path formatted as: `cite: <absolute path>`.

## Rationale
This rule ensures that downstream tooling, automated scripts, and AI agents interacting with the CLI output can reliably locate and track the physical source file of any note without having to guess or re-query the file system. It acts as a strict contract for data provenance.