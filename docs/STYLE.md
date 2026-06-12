# TypeScript Style & Coding Conventions

## Code Formatting
* Use standard TypeScript formatting (2-space indentation).
* Prefer `import { ... } from "node:fs/promises"` built-ins over third-party file-system wrappers.

## Naming Conventions
* Variables and function names must use `camelCase`.
* Types and Interfaces must use `PascalCase`.

## Error Handling
* Avoid generic error messages. When throwing or logging an error, ensure it explicitly names the failing component or file context (e.g., `console.error("ask requires a query")`).

## Promoted from review

| Date       | Reviewer comment              | Lint rule                  |
|------------|-------------------------------|----------------------------|
| 2025-MM-DD | "src files use single quotes" | `quotes: ["error","single"]` |