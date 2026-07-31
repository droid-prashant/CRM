# Code Review Standards

This document defines the standards and criteria reviewers should follow before approving changes to the IntelliSync CRM codebase.

## Project Context

- Backend: .NET 8 solution at `src/API/CRM.sln`
- Frontend: Angular client at `src/ClientApp`
- Primary domains: dashboard, leads, clients, opportunities, partners, and products

## Approval Criteria

A PR is ready to approve only when all required criteria are satisfied:

- The implementation matches the requirement, issue, or acceptance criteria.
- The change is limited to the intended scope.
- The coding approach is consistent with the existing architecture, naming, layering, and project conventions.
- The code builds successfully.
- Existing behavior is not broken unless the PR clearly documents the intentional change.
- API contracts, DTOs, validation, and UI flows remain consistent.
- Security and authorization rules are enforced server-side.
- Tests are added or updated when the change affects business rules, user workflows, data access, or bug fixes.
- No secrets, local machine paths, generated uploads, or unrelated files are committed.

## Coding Approach Standard

Correct output alone is not enough for approval. A change must produce the expected application behavior using code that fits the project consistently and can be maintained safely.

Reviewers should reject code that appears to be generated only to satisfy the visible output while ignoring established structure, naming, abstractions, validation, security, or long-term maintainability.

### Required Coding Approach

- Follow the existing folder structure, module boundaries, naming conventions, and dependency direction.
- Reuse existing patterns, helpers, services, DTOs, validators, components, and shared styles before introducing new ones.
- Keep business rules in the application or domain layer, not in controllers, infrastructure classes, or UI components.
- Keep controllers thin and focused on request handling, authorization, response shaping, and delegation.
- Keep frontend components focused on presentation and interaction, with API and business workflow logic placed in the appropriate services or state layer.
- Use typed models, DTOs, and interfaces instead of loosely shaped objects or duplicated ad hoc structures.
- Validate input at the correct boundary and do not rely on frontend validation for server-side rules.
- Handle errors through the project's existing error-handling pattern instead of swallowing exceptions or returning inconsistent responses.
- Prefer small, readable changes over broad rewrites when the requirement is narrow.
- Add new abstractions only when they remove real duplication or match an existing project pattern.

### AI-Generated Code Review Criteria

When code is written with help from an AI agent, reviewers must evaluate the code itself, not only the final screen or API response.

- The solution must look like it belongs in this repository.
- The code must be explainable by the developer who submits it.
- The implementation must not introduce unused files, speculative helpers, dead code, or generic boilerplate.
- The implementation must not bypass existing services, repositories, validators, authorization checks, or shared UI components.
- The same rule must not be implemented differently in multiple places.
- The code must not hard-code values that should come from configuration, constants, enums, database records, or API responses.
- The solution must remain testable without depending on hidden timing, manual steps, or local machine state.

### Unacceptable Coding Approaches

Do not approve code that uses any of these approaches:

- Large generated rewrites for a small requirement.
- Copy-pasted logic from another module without adapting it to the correct domain model.
- New patterns that conflict with nearby files or existing architecture.
- Business rules duplicated in both frontend and backend as independent sources of truth.
- Controllers or components that contain complex data access, calculations, or workflow decisions.
- Hard-coded IDs, role names, status strings, URLs, file paths, dates, or magic numbers without a project-approved constant or configuration.
- Silent failure handling, empty catch blocks, or generic success responses when an operation may fail.
- Untyped or weakly typed data used where the project already has DTOs, models, or interfaces.
- Code that only satisfies the visible happy path while leaving edge cases, permissions, or persistence behavior incorrect.

## Review Standards

### Correctness Standard

Code must solve the stated problem completely and handle realistic edge cases. Reviewers should check empty data, missing records, invalid IDs, duplicate requests, permission failures, and error responses.

### Architecture Standard

Code must follow the existing project structure. Business rules should live in the application or domain layer, not inside controllers or UI components. Infrastructure code should not leak into domain models.

### API Standard

APIs must use stable DTOs, clear route names, appropriate HTTP status codes, and consistent response shapes. Controllers should not expose database entities directly.

### Frontend Standard

Angular components must follow existing structure, styling, and state-management patterns. Screens must handle loading, empty, success, validation error, and server error states where relevant.

### Security Standard

Authentication, authorization, input validation, file handling, and sensitive data protection must be reviewed carefully. Never rely only on frontend checks for security.

### Data Standard

Database and model changes must preserve existing data unless migration or cleanup behavior is explicitly planned. New statuses, enum values, or required fields must be handled everywhere they are read or displayed.

When a database change is introduced through an EF migration, `src/DatabaseScripts/production_migrations.sql` must be updated in the same PR. A migration is not complete for review until both the EF migration and the production migration script are present and aligned.

Production migration SQL must be deployment-safe and reviewable. Do not approve arbitrary SQL just because it creates the expected table or column.

Required rules for `production_migrations.sql` changes:

- Add a clearly separated migration block near the end of the file, before the final `COMMIT;`.
- Insert the matching migration ID into `__EFMigrationsHistory` with `ON CONFLICT ("MigrationId") DO NOTHING`.
- Use idempotent statements such as `CREATE SCHEMA IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, guarded `ALTER TABLE`, and conflict-safe seed inserts.
- Guard constraints, foreign keys, columns, and indexes so the script can run safely more than once or against a partially updated database.
- Keep schema, table, column, index, constraint, precision, nullability, defaults, and seed data consistent with the EF migration.
- For new required columns on existing tables, include a safe default or backfill strategy before enforcing `NOT NULL`.
- For data changes, make the target rows explicit and reversible by review; avoid broad updates without filters.
- Avoid destructive operations such as dropping columns, truncating tables, deleting data, or changing column types in a lossy way unless the PR documents the data impact and approval plan.
- Do not include local database names, machine paths, credentials, environment-specific values, or manual one-off SQL.
- Keep seed data deterministic and conflict-safe, especially IDs, codes, names, and unique keys.

### Testing Standard

Tests should cover the main success path and the highest-risk failure paths. A PR can be approved without new tests only when the change is low risk, clearly mechanical, or covered by existing tests.

### Maintainability Standard

Code should be readable, consistent with nearby files, and simple enough to change later. Avoid unnecessary abstractions, unrelated refactors, duplicated business logic, and unclear naming.

## Before Reviewing

1. Read the PR description, linked issue, and acceptance criteria.
2. Identify the changed modules and whether the change affects API contracts, persistence, authentication, authorization, or user-facing workflows.
3. Check whether tests, migrations, DTOs, validation rules, and UI states were updated where needed.

## Suggested Local Checks

Run the checks that match the files changed by the PR.

## Using This With An AI Agent

This file is not executed directly. It must be given to the AI agent as review instructions.

Use this prompt when asking an agent to review current local changes:

```text
Read CODE_REVIEW.md first.
Review the current git changes against those standards.
Focus on correctness, coding approach, architecture consistency, security, data handling, tests, and maintainability.
Do not only check whether the output works.
List findings first, ordered by severity.
For each finding, include the file path, line number, impact, and suggested fix.
If there are no blocking issues, say that clearly and mention any remaining risks or missing tests.
Do not modify code during the review.
```

If using Codex from a terminal, the request can be written like this:

```powershell
codex "Read CODE_REVIEW.md first. Review the current git changes against those standards. List findings first with file path, line number, impact, and suggested fix. Do not modify code."
```

If reviewing a specific branch or PR, make sure the agent has access to the diff before running the review.

### Backend

```powershell
dotnet restore src/API/CRM.sln
dotnet build src/API/CRM.sln --no-restore
```

If backend tests are added later, run them before approving API or domain changes.

### Frontend

```powershell
cd src/ClientApp
npm install
npm run build
npm test
```

## Review Checklist

### Correctness

- The implementation satisfies the stated requirement without introducing unrelated behavior.
- Edge cases are handled, including empty data, missing records, invalid IDs, duplicate requests, and permission failures.
- Public API responses use stable DTOs and do not expose internal entities or sensitive fields.
- Error handling is clear and returns appropriate status codes or UI messages.
- Date, time, currency, and numeric calculations are handled consistently.

### Backend

- Domain rules live in the appropriate application/domain layer rather than being hidden in controllers.
- Commands and queries validate inputs before changing state.
- Entity relationships, includes, filters, and projections avoid accidental over-fetching.
- Async database calls use cancellation tokens where the surrounding code supports them.
- New endpoints follow existing route, naming, response, and authorization patterns.
- Configuration and secrets are not hard-coded or committed.

### Frontend

- Components follow existing Angular structure, naming, and styling conventions.
- Forms validate required fields, invalid formats, loading states, and submit errors.
- API calls have clear success, empty, loading, and failure states.
- State updates do not rely on stale data after create, update, delete, or navigation flows.
- UI text is concise and user-facing labels are consistent across the app.
- Responsive layouts remain usable on narrow screens.

### Security

- Authentication and authorization are enforced server-side.
- Users cannot access or mutate records outside their allowed scope.
- File uploads, if touched, validate size, type, path, and storage behavior.
- User input is validated and encoded before display.
- Logs do not include passwords, tokens, secrets, or sensitive customer data.

### Data And Compatibility

- Database schema changes are backwards-compatible or clearly coordinated.
- EF migrations that change the database also update `src/DatabaseScripts/production_migrations.sql`.
- Production migration SQL is idempotent, guarded, and aligned with the EF migration.
- Existing records remain valid after the change.
- API changes do not break existing frontend consumers unless the PR explicitly includes the matching update.
- New enum values, statuses, or constants are handled everywhere they are displayed or processed.

### Maintainability

- The change is small enough to understand and avoids unrelated refactoring.
- Names describe business meaning rather than implementation details.
- Shared behavior is reused through existing helpers or patterns.
- Comments explain non-obvious decisions, not routine code.
- New dependencies are justified and fit the existing stack.

### Tests

- Tests cover the main success path and the highest-risk failure paths.
- Business rules are tested close to where they are implemented.
- UI changes include component or workflow coverage where practical.
- Test data is clear and does not depend on execution order.

## Avoid Approving When

Do not approve a PR when any of the following are present:

- The code does not build.
- The PR includes unrelated changes that are not explained.
- A user can access, update, or delete data they should not control.
- The backend trusts client-side validation for important rules.
- A database migration is added without the matching `src/DatabaseScripts/production_migrations.sql` update.
- The production migration script is not idempotent, is not aligned with the EF migration, or contains unsafe destructive SQL without an approved data plan.
- API changes are not reflected in the frontend or dependent consumers.
- Error cases fail silently or expose technical details to users.
- File uploads accept unsafe file types, paths, or sizes.
- Secrets, credentials, tokens, generated files, or local configuration are committed.
- The change duplicates existing business logic instead of using the established pattern.
- Required tests are missing for risky business logic, data access, or bug fixes.

## Findings Template

Use this format for review comments:

```markdown
**Issue:** Briefly describe the problem.

**Impact:** Explain what can go wrong for users, data, security, or maintainability.

**Location:** `path/to/file.ext:line`

**Suggestion:** Provide a concrete fix or direction.
```

## Approval Guidance

Approve when the change is correct, scoped, tested appropriately for its risk, and consistent with the project patterns.

Request changes when there is a likely bug, security issue, broken workflow, missing validation, data loss risk, or an API/frontend mismatch.

Leave non-blocking comments for readability improvements, naming suggestions, or cleanup that would be helpful but should not hold the PR.
