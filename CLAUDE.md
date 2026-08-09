# IntelliSync CRM — Agent Instructions

## Mandatory: Read CODE_REVIEW.md first

Before writing or modifying any code in this repository, read [CODE_REVIEW.md](CODE_REVIEW.md) in full. It is the mandatory development and code review standard for this project and applies to every backend, frontend, and database change.

Key rules from that standard, summarized:

- Inspect the existing project structure and at least one comparable existing feature before introducing a new pattern.
- Follow existing architecture, folder structure, naming conventions, and coding patterns — do not introduce new frameworks, libraries, or architectural layers unless explicitly required.
- Prefer the simplest implementation that satisfies the requirement. Avoid overengineering, unnecessary abstractions, and speculative reusability.
- Keep changes limited to the requested scope. Do not refactor unrelated code or rename existing public contracts without explicit approval.
- Backend (.NET 8, `src/API/CRM.sln`) and frontend (Angular, `src/ClientApp`) validation, security, and error handling must follow the patterns already established in the codebase — see CODE_REVIEW.md sections 4 and 5 for full checklists.
- Any EF Core migration must be accompanied by an update to `src/DatabaseScripts/production_migrations.sql` in the same change (see CODE_REVIEW.md §7.1) — idempotent, guarded, no destructive operations without an approved data plan.
- Before reporting work complete, self-review using CODE_REVIEW.md §9 and report using the completion format in §10: files changed, existing pattern followed, requirement coverage, validation performed, testing performed (only report tests actually run), and risks/assumptions.
- Never claim a build succeeded or tests passed without actually running them.

## Project Context

- Backend: .NET 8 solution at `src/API/CRM.sln`.
- Frontend: Angular client at `src/ClientApp`.
- Production database script: `src/DatabaseScripts/production_migrations.sql`.
- Primary domains: dashboard, leads, clients, opportunities, partners, products, users, roles, and permissions.
