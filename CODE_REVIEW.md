# AI Code Review & Development Standard

## 1. Purpose

This document defines the mandatory development and code review standards that must be followed by AI coding agents while working on .NET Core and Angular applications.

The objective is to ensure that AI-generated code:

- Follows the existing project architecture.
- Uses the existing coding patterns and naming conventions.
- Remains simple, readable, and maintainable.
- Does not introduce unnecessary abstractions or complexity.
- Can be easily understood and reviewed by human developers.
- Does not create breaking changes without explicit approval.
- Meets security, performance, validation, and testing expectations.

---


## 1.1 IntelliSync CRM Project Context

Unless a task explicitly targets another repository, AI agents must use the following CRM context:

- Backend: .NET 8 solution at `src/API/CRM.sln`.
- Frontend: Angular client at `src/ClientApp`.
- Production database script: `src/DatabaseScripts/production_migrations.sql`.
- Primary domains include dashboard, leads, clients, opportunities, partners, products, users, roles, and permissions.
- The implementation must follow the architecture, module boundaries, and conventions already established in the IntelliSync CRM repository.
- The agent must inspect nearby files and at least one comparable existing feature before introducing a new implementation pattern.


## 2. Mandatory Instructions for AI Agents

Before writing or modifying any code, the AI agent must:

1. Inspect the existing project structure.
2. Identify similar existing implementations.
3. Follow the same architecture, folder structure, naming convention, and coding pattern.
4. Reuse existing services, components, utilities, validators, models, helpers, and shared code where appropriate.
5. Avoid introducing new frameworks, libraries, patterns, or architectural layers unless explicitly required.
6. Prefer the simplest implementation that satisfies the requirement.
7. Avoid overengineering.
8. Avoid creating generic or reusable abstractions unless there is a confirmed repeated use case.
9. Keep changes limited to the requested requirement.
10. Do not refactor unrelated code.
11. Do not rename existing files, classes, methods, variables, APIs, database objects, or routes unless explicitly required.
12. Do not change public contracts without identifying the impact.
13. Preserve backward compatibility whenever possible.
14. Clearly mention assumptions where the requirement is unclear.
15. Do not silently change business rules.

---

## 3. General Code Review Checklist

### 3.1 Requirement Compliance

- [ ] The implementation fully satisfies the stated requirement.
- [ ] No unrelated functionality has been added.
- [ ] Existing business rules have been preserved.
- [ ] Edge cases have been considered.
- [ ] Error scenarios have been handled.
- [ ] Acceptance criteria have been implemented.
- [ ] Assumptions are documented.
- [ ] Breaking changes are clearly identified.

### 3.2 Simplicity and Maintainability

- [ ] The implementation uses the simplest reasonable solution.
- [ ] The code is easy for another developer to understand.
- [ ] There is no unnecessary abstraction.
- [ ] There is no unnecessary inheritance.
- [ ] There are no unnecessary design patterns.
- [ ] There are no unnecessary helper classes or wrapper services.
- [ ] Duplicate logic has been avoided where practical.
- [ ] Existing shared logic has been reused.
- [ ] Methods and components have a clear responsibility.
- [ ] Complex logic is broken into understandable units.
- [ ] Magic numbers and unexplained string values are avoided.
- [ ] Comments explain business reasons, not obvious code behavior.

### 3.3 Naming and Formatting

- [ ] Existing project naming conventions are followed.
- [ ] Class, method, property, variable, file, and folder names are meaningful.
- [ ] Names clearly describe business purpose.
- [ ] Abbreviations are avoided unless already standard in the project.
- [ ] Formatting matches the existing codebase.
- [ ] No unused imports, using statements, variables, methods, or files remain.
- [ ] No commented-out code remains.
- [ ] No temporary debugging code remains.
- [ ] No unnecessary console logs remain.

### 3.4 Security

- [ ] Authentication requirements are enforced.
- [ ] Authorization and permission checks are enforced.
- [ ] Sensitive data is not logged.
- [ ] Passwords, tokens, secrets, and connection strings are not hardcoded.
- [ ] User input is validated.
- [ ] Database queries are protected against injection.
- [ ] APIs do not expose unnecessary internal information.
- [ ] Error responses do not reveal stack traces or sensitive details.
- [ ] File uploads validate file type, size, and name.
- [ ] Business-level access checks are performed, not only UI-level checks.

### 3.5 Performance

- [ ] Database queries retrieve only required data.
- [ ] Unnecessary loops and repeated calculations are avoided.
- [ ] Repeated API calls are avoided.
- [ ] Large collections are paginated where applicable.
- [ ] Long-running operations are asynchronous where applicable.
- [ ] UI rendering avoids unnecessary repeated work.
- [ ] No obvious memory leaks are introduced.
- [ ] No unnecessary object mapping or data transformation is introduced.

### 3.6 Error Handling

- [ ] Expected errors are handled.
- [ ] Error messages are meaningful and user-friendly.
- [ ] Exceptions are not silently ignored.
- [ ] Logging is added where operationally useful.
- [ ] Validation errors are distinguishable from system errors.
- [ ] The implementation does not use exceptions for normal control flow.
- [ ] Existing centralized error-handling mechanisms are used.

### 3.7 Testing

- [ ] Existing tests remain valid.
- [ ] New business logic has relevant unit or integration tests.
- [ ] Positive scenarios are tested.
- [ ] Validation failures are tested.
- [ ] Authorization failures are tested where applicable.
- [ ] Edge cases are tested.
- [ ] Tests follow the existing naming and arrangement pattern.
- [ ] Tests do not depend on execution order.
- [ ] Mocking is limited to appropriate boundaries.

---

# 4. .NET Core Development and Review Standard

## 4.1 Architecture

The AI agent must:

- Follow the existing architecture, such as layered architecture, clean architecture, modular monolith, vertical slice, or another established pattern.
- Place code in the same module and layer used by similar features.
- Respect project references and dependency direction.
- Avoid adding a new layer merely for one small requirement.
- Avoid moving existing code across layers unless explicitly requested.
- Reuse existing command, query, handler, repository, service, specification, or mediator patterns where already used.
- Avoid introducing CQRS, MediatR, repositories, specifications, or unit-of-work patterns if the project does not already use them.

### Review Checklist

- [ ] Code is placed in the correct project, module, and folder.
- [ ] Dependency direction is respected.
- [ ] Domain logic is not incorrectly placed in controllers.
- [ ] Infrastructure concerns are not leaked into the domain layer.
- [ ] Existing architectural patterns are followed.
- [ ] No new architecture pattern has been introduced unnecessarily.

---

## 4.2 Controllers and API Endpoints

- Controllers must remain thin.
- Controllers should handle routing, request binding, authorization, and response creation.
- Business logic must be delegated to the appropriate application or domain service.
- Existing route naming and API versioning conventions must be followed.
- HTTP status codes must accurately represent the result.
- API responses must follow the existing response format.
- Request and response contracts must not expose database entities directly unless the existing project explicitly follows that approach.

### Review Checklist

- [ ] Endpoint route follows existing conventions.
- [ ] Correct HTTP method is used.
- [ ] Correct status codes are returned.
- [ ] Authorization attributes or permission checks are present.
- [ ] Request models are validated.
- [ ] Controller contains no unnecessary business logic.
- [ ] Response model does not expose sensitive fields.
- [ ] Existing API response wrapper is used where applicable.
- [ ] CancellationToken is passed where supported.

---

## 4.3 Application and Business Logic

- Business rules must be explicit and readable.
- Existing services and handlers must be extended rather than duplicated.
- Large methods must be split only where doing so improves clarity.
- Avoid creating interfaces that have only one implementation unless the existing architecture requires it.
- Avoid excessive mapping layers.
- Avoid unnecessary factories, strategies, builders, and generic services.
- Do not make a method generic without an actual reusable requirement.

### Review Checklist

- [ ] Business rules are implemented in the appropriate layer.
- [ ] Logic matches the acceptance criteria.
- [ ] Existing business logic is reused.
- [ ] Duplicate validations are avoided.
- [ ] Method names clearly describe behavior.
- [ ] No hidden side effects exist.
- [ ] Transactions are used where multiple related writes must succeed together.
- [ ] CancellationToken is propagated through asynchronous operations.

---

## 4.4 Entity Framework Core and Database Access

- Use asynchronous EF Core methods for database operations.
- Use `AsNoTracking()` for read-only queries where appropriate.
- Avoid loading entire tables into memory.
- Avoid N+1 query problems.
- Select only required fields for list and report queries.
- Use pagination for potentially large result sets.
- Follow existing repository or DbContext access patterns.
- Do not add a repository layer if the project directly uses DbContext.
- Do not execute raw SQL unless necessary and justified.
- Database changes must include proper EF Core migrations.
- Migrations must not contain unrelated schema changes.
- Foreign keys, indexes, nullability, lengths, and delete behaviors must be reviewed.

### Review Checklist

- [ ] Query uses async execution.
- [ ] Read-only query uses `AsNoTracking()` where appropriate.
- [ ] Query avoids N+1 problems.
- [ ] Query retrieves only required data.
- [ ] Pagination is used where appropriate.
- [ ] Null values are safely handled.
- [ ] Database constraints support the business rule.
- [ ] Required indexes are considered.
- [ ] Migration contains only intended changes.
- [ ] Migration has a clear and meaningful name.
- [ ] Delete behavior is explicitly reviewed.
- [ ] Concurrency risk is considered where applicable.
- [ ] Transactions are used for related writes.
- [ ] Database-generated values and timestamps are handled consistently.

---

## 4.5 DTOs, Models, and Mapping

- Use existing request, response, DTO, and mapping patterns.
- Do not expose EF Core entities directly unless that is the established project convention.
- Avoid creating multiple DTOs with identical fields without a real reason.
- Map only required fields.
- Validation belongs in the appropriate request validator, model, or business layer.
- Response models must not expose audit, security, or internal fields unless required.

### Review Checklist

- [ ] Request and response models are clearly separated where required.
- [ ] DTO names follow existing conventions.
- [ ] Mapping is simple and readable.
- [ ] No sensitive fields are exposed.
- [ ] Nullable properties match business and database requirements.
- [ ] Date, time, currency, and decimal types are appropriate.

---

## 4.6 Validation

- Use the existing validation mechanism, such as FluentValidation, data annotations, or custom validators.
- Validate required fields, ranges, lengths, formats, and relationships.
- Do not depend only on frontend validation.
- Business validations requiring database access must be performed in the backend.
- Duplicate record checks must consider concurrency and database constraints.

### Review Checklist

- [ ] Required fields are validated.
- [ ] String length limits are validated.
- [ ] Numeric ranges are validated.
- [ ] Date rules are validated.
- [ ] Email, phone, and other formats are validated.
- [ ] Related entity IDs are verified.
- [ ] Duplicate conditions are handled.
- [ ] Validation messages are understandable.
- [ ] Backend validation exists even when frontend validation is present.

---

## 4.7 Async and Threading

- Use `async` and `await` for I/O-bound operations.
- Do not use `.Result`, `.Wait()`, or `.GetAwaiter().GetResult()` in application code.
- Avoid `Task.Run()` for normal database or HTTP operations.
- Pass CancellationToken where available.
- Do not mark methods async without awaiting asynchronous work.

### Review Checklist

- [ ] Async methods are truly asynchronous.
- [ ] No blocking async calls exist.
- [ ] CancellationToken is propagated.
- [ ] Parallel execution is used only when safe and beneficial.
- [ ] Shared mutable state is avoided.

---

## 4.8 Dependency Injection

- Use the existing dependency registration structure.
- Choose the correct service lifetime.
- Avoid service locator patterns.
- Avoid injecting unnecessary dependencies.
- Avoid circular dependencies.
- Do not create static service access for convenience.

### Review Checklist

- [ ] Dependency is registered.
- [ ] Lifetime is correct.
- [ ] Constructor has only necessary dependencies.
- [ ] No circular dependency exists.
- [ ] Existing registration extension methods are followed.

---

## 4.9 Logging and Auditing

- Use the existing logging framework.
- Use structured logging.
- Do not log secrets, tokens, passwords, or sensitive personal information.
- Log meaningful operational events and failures.
- Avoid excessive logs inside loops.
- Audit user actions where the business requirement requires traceability.

### Review Checklist

- [ ] Structured log placeholders are used.
- [ ] Sensitive information is excluded.
- [ ] Log level is appropriate.
- [ ] Errors include useful context.
- [ ] User/action auditing is added where required.
- [ ] No duplicate logging occurs across layers.

---

## 4.10 .NET Code Quality

### Required Practices

- Follow existing C# language and style conventions.
- Use nullable reference types consistently with the project.
- Prefer guard clauses for invalid conditions when they improve readability.
- Use constants or enums for stable business values where appropriate.
- Avoid excessive use of reflection or dynamic types.
- Avoid deeply nested conditions.
- Avoid large service classes with unrelated responsibilities.
- Do not suppress compiler warnings without justification.
- Do not use the null-forgiving operator merely to hide a possible null issue.

### Review Checklist

- [ ] Nullable values are handled correctly.
- [ ] No warning is hidden without justification.
- [ ] Methods are focused and readable.
- [ ] Pattern matching and LINQ are used only where readable.
- [ ] LINQ queries do not perform hidden expensive operations.
- [ ] Enums and constants are used consistently.
- [ ] No unnecessary region blocks exist.
- [ ] Public methods have clear behavior.

---

# 5. Angular Development and Review Standard

## 5.1 Angular Architecture

The AI agent must:

- Follow the existing Angular version and project structure.
- Follow the existing standalone component or NgModule pattern.
- Follow the existing feature module and shared module structure.
- Reuse existing common components, services, pipes, directives, validators, guards, interceptors, and utilities.
- Avoid introducing a state-management library unless already used or explicitly required.
- Avoid creating a shared component for a one-time use case.
- Avoid changing the entire application structure for one feature.

### Review Checklist

- [ ] Code is placed in the correct feature folder.
- [ ] Existing Angular architecture is followed.
- [ ] Standalone and module patterns are not mixed incorrectly.
- [ ] Shared code is reused where appropriate.
- [ ] No unnecessary library or architecture has been introduced.
- [ ] Feature remains isolated from unrelated modules.

---

## 5.2 Components

- Components must focus on presentation and user interaction.
- Complex business logic should be placed in services or dedicated utilities where appropriate.
- Avoid very large components.
- Avoid duplicating API, form, or grid logic already available in the project.
- Use meaningful input and output names.
- Manage component state explicitly and clearly.
- Do not directly manipulate the DOM unless necessary.
- Follow the existing component naming and file naming convention.

### Review Checklist

- [ ] Component has a clear responsibility.
- [ ] Component does not contain unnecessary business logic.
- [ ] Inputs and outputs are typed.
- [ ] Public and private members follow project conventions.
- [ ] Template logic is not overly complex.
- [ ] Repeated template expressions are avoided.
- [ ] Direct DOM manipulation is avoided.
- [ ] Lifecycle hooks contain only appropriate logic.
- [ ] Subscriptions are cleaned up.
- [ ] Loading, empty, success, and error states are handled.

---

## 5.3 Services and API Integration

- Reuse the existing API service pattern.
- API URLs must use environment configuration and existing route constants where applicable.
- Do not hardcode server URLs.
- Return typed observables.
- Centralized interceptors must handle cross-cutting concerns such as authentication and common errors.
- Avoid subscribing inside services unless the service is intentionally managing state or side effects.
- Components should not duplicate HTTP request construction.

### Review Checklist

- [ ] Service follows existing naming and folder conventions.
- [ ] API methods are strongly typed.
- [ ] URLs are not hardcoded.
- [ ] HTTP parameters are constructed correctly.
- [ ] Subscription responsibility is appropriate.
- [ ] Errors are handled consistently.
- [ ] Duplicate API methods are avoided.
- [ ] Cancellation or request replacement is considered for searches and filters.

---

## 5.4 Reactive Forms and Validation

- Follow the existing form strategy.
- Prefer reactive forms when the application already uses them.
- Use typed forms where supported by the project.
- Reuse existing validators.
- Apply frontend validation for user experience and backend validation for security.
- Show clear validation messages.
- Prevent submission while invalid or already submitting.
- Properly mark controls as touched when validation must be displayed.

### Review Checklist

- [ ] Form model matches the API request.
- [ ] Required validators are applied.
- [ ] Length, range, pattern, and custom rules are applied.
- [ ] Validation messages match the actual validation rule.
- [ ] Form submission handles invalid state.
- [ ] Double submission is prevented.
- [ ] Disabled fields are intentionally included or excluded.
- [ ] Reset and edit-mode behavior work correctly.
- [ ] Server-side validation errors are displayed appropriately.

---

## 5.5 RxJS

- Use RxJS operators only where they improve clarity.
- Avoid deeply nested subscriptions.
- Prefer `switchMap`, `concatMap`, `mergeMap`, or `forkJoin` only when their behavior is understood and appropriate.
- Use `takeUntilDestroyed`, async pipe, or the project's established cleanup pattern.
- Avoid unnecessary Subjects and BehaviorSubjects.
- Do not use a state stream where a simple component property is sufficient.
- Debounce search input where appropriate.
- Handle errors without terminating important long-lived streams unexpectedly.

### Review Checklist

- [ ] No nested subscription exists without justification.
- [ ] Subscription cleanup is implemented.
- [ ] Correct mapping operator is used.
- [ ] Search input is debounced where appropriate.
- [ ] Duplicate API calls are avoided.
- [ ] Async pipe is used where appropriate.
- [ ] Error handling does not break required streams.
- [ ] Subjects are used only when necessary.

---

## 5.6 Templates and UI

- Follow the existing UI library and design system.
- Do not introduce a new UI library for a single feature.
- Maintain consistent spacing, typography, buttons, forms, dialogs, grids, colors, and responsive behavior.
- Avoid complex expressions in templates.
- Use Angular structural and control-flow syntax consistent with the project version.
- Include loading, no-data, error, and permission-denied states where applicable.
- Ensure buttons and form controls have understandable labels.
- Ensure accessibility basics are maintained.

### Review Checklist

- [ ] UI matches the existing application.
- [ ] Existing components and CSS classes are reused.
- [ ] No inline style is added unless consistent with the project.
- [ ] Template expressions are simple.
- [ ] Loading state is displayed.
- [ ] Empty state is displayed.
- [ ] Error state is displayed.
- [ ] Responsive behavior is considered.
- [ ] Labels are connected to inputs.
- [ ] Buttons have meaningful text or accessible labels.
- [ ] Permission-based visibility is not the only authorization control.

---

## 5.7 TypeScript Quality

- Avoid `any` unless there is a documented reason.
- Use interfaces, types, or classes consistently with the project.
- Use strict null handling.
- Use enums or constants where the project uses them.
- Avoid non-null assertions that hide real nullability problems.
- Avoid unnecessary type casting.
- Keep models aligned with backend contracts.
- Do not duplicate interface definitions across multiple features.

### Review Checklist

- [ ] No avoidable `any` type exists.
- [ ] API response types are defined.
- [ ] Null and undefined cases are handled.
- [ ] Type assertions are justified.
- [ ] Models follow existing naming conventions.
- [ ] Shared models are reused where appropriate.
- [ ] Enum values match backend values.
- [ ] Date and numeric values are handled consistently.

---

## 5.8 Angular Performance

- Use track expressions or `trackBy` for repeated lists where appropriate.
- Avoid calling expensive methods from templates.
- Avoid unnecessary change detection triggers.
- Use lazy loading where already supported by the project.
- Avoid loading large datasets without pagination.
- Avoid repeated API calls during component initialization.
- Use caching only when there is a clear requirement and invalidation strategy.

### Review Checklist

- [ ] Large lists use pagination or virtual scrolling where required.
- [ ] Repeated lists have stable tracking.
- [ ] Template does not call expensive functions.
- [ ] API calls are not duplicated.
- [ ] Lazy loading pattern is preserved.
- [ ] Change detection strategy is not changed without reason.
- [ ] Images and attachments are handled efficiently.

---

## 5.9 Angular Security

- Do not trust frontend authorization alone.
- Avoid bypassing Angular sanitization.
- Avoid rendering untrusted HTML.
- Do not store sensitive information unnecessarily in localStorage or sessionStorage.
- Do not log tokens or personal data.
- Use the existing authentication and authorization guards.
- Ensure route guards and menu visibility follow the same permission rules.
- File uploads must validate client-side, while backend validation remains mandatory.

### Review Checklist

- [ ] No unsafe HTML rendering exists.
- [ ] No sanitization bypass exists without justification.
- [ ] Sensitive data is not stored unnecessarily.
- [ ] Permission checks follow existing patterns.
- [ ] Route access is protected where applicable.
- [ ] UI restriction is backed by server-side authorization.
- [ ] No secret or environment-specific credential is included in source code.

---

## 5.10 Styling

- Follow the existing SCSS, CSS, or utility-class approach.
- Reuse existing theme variables and shared styles.
- Avoid global style changes for a feature-specific requirement.
- Avoid `!important` unless unavoidable and documented.
- Avoid duplicate CSS.
- Keep selectors scoped and understandable.
- Ensure styles do not break other screens.

### Review Checklist

- [ ] Existing theme variables are used.
- [ ] Styles are properly scoped.
- [ ] Global CSS changes are justified.
- [ ] No avoidable `!important` exists.
- [ ] Responsive styles are included where necessary.
- [ ] No unrelated UI is affected.

---

# 6. API Contract Review

When both .NET Core and Angular are modified, verify the complete contract.

### Review Checklist

- [ ] Endpoint route matches frontend usage.
- [ ] HTTP method matches frontend usage.
- [ ] Request property names match.
- [ ] Response property names match.
- [ ] Data types match.
- [ ] Nullable fields match.
- [ ] Enum values match.
- [ ] Date and time formats match.
- [ ] Pagination format matches.
- [ ] Validation errors can be displayed by the frontend.
- [ ] Authorization requirements are handled.
- [ ] File upload and download contracts match.
- [ ] Backward compatibility has been considered.

---

# 7. Database Change Review

For every database change:

- [ ] Entity configuration is updated.
- [ ] Database migration is created.
- [ ] Migration contains only intended changes.
- [ ] Column type is appropriate.
- [ ] String length is defined where appropriate.
- [ ] Required and nullable behavior is correct.
- [ ] Foreign keys are defined.
- [ ] Delete behavior is reviewed.
- [ ] Unique constraints are added where required.
- [ ] Indexes are added where query patterns require them.
- [ ] Existing data migration is considered.
- [ ] Rollback impact is understood.
- [ ] Seed data is updated where applicable.
- [ ] Frontend and backend models are updated.
- [ ] Production deployment impact is identified.

---


## 7.1 IntelliSync CRM Production Migration SQL Standard

For the IntelliSync CRM project, an EF Core migration is incomplete unless the same pull request also updates:

`src/DatabaseScripts/production_migrations.sql`

The EF migration and production SQL must remain aligned.

### Mandatory Rules

- Add a clearly separated migration block near the end of the script and before the final `COMMIT;`.
- Insert the corresponding migration ID into `__EFMigrationsHistory`.
- Use `ON CONFLICT ("MigrationId") DO NOTHING` when inserting migration history.
- Prefer deployment-safe and idempotent statements, including:
  - `CREATE SCHEMA IF NOT EXISTS`
  - `CREATE TABLE IF NOT EXISTS`
  - `CREATE INDEX IF NOT EXISTS`
  - Guarded `ALTER TABLE`
  - Conflict-safe seed inserts
- Guard columns, constraints, foreign keys, and indexes so the script can run safely more than once or against a partially updated database.
- Keep schema, table, column, index, constraint, precision, nullability, default, and seed-data definitions consistent with the EF migration.
- When adding a required column to an existing table, provide a safe default or backfill strategy before enforcing `NOT NULL`.
- Data update statements must identify the exact target records and use appropriate filters.
- Avoid destructive operations such as dropping columns, truncating tables, deleting records, or lossy type conversions unless the pull request documents:
  - Data impact
  - Backup or rollback approach
  - Product or technical approval
  - Deployment sequence
- Do not include local database names, local file paths, credentials, environment-specific values, or manual one-time commands.
- Seed data must be deterministic and conflict-safe, especially for IDs, codes, names, and unique keys.

### Review Checklist

- [ ] EF migration is included.
- [ ] `production_migrations.sql` is updated.
- [ ] EF migration and SQL script are aligned.
- [ ] Migration history entry is included.
- [ ] Script is idempotent.
- [ ] Existing data is protected.
- [ ] Required-column backfill is safe.
- [ ] Constraints and indexes are guarded.
- [ ] No environment-specific values are included.
- [ ] Destructive changes have an approved data plan.


# 8. Pull Request Review Standard

Every pull request created or reviewed by an AI agent must include:

## 8.1 Summary

- What was changed?
- Why was it changed?
- Which requirement or issue does it address?

## 8.2 Scope

- Backend changes.
- Frontend changes.
- Database changes.
- Configuration changes.
- Dependency changes.

## 8.3 Testing Performed

- Unit tests.
- Integration tests.
- Manual test scenarios.
- Validation scenarios.
- Permission scenarios.
- Browser or responsive checks where applicable.

## 8.4 Risk and Impact

- Possible regression areas.
- Breaking changes.
- Database migration risk.
- Security impact.
- Performance impact.
- Deployment considerations.

## 8.5 Reviewer Checklist

- [ ] Requirement is fully implemented.
- [ ] Code follows the existing architecture.
- [ ] Code is simple and understandable.
- [ ] No unrelated refactoring is included.
- [ ] Backend validation is present.
- [ ] Authorization is enforced.
- [ ] Error handling is appropriate.
- [ ] Database changes are safe.
- [ ] Angular subscriptions are handled.
- [ ] API contracts match.
- [ ] Tests are sufficient.
- [ ] No secrets or sensitive data are committed.
- [ ] No debug code remains.
- [ ] Build succeeds.
- [ ] Existing tests pass.

---


# 8.6 AI Review Workflow

When an AI agent is asked to review code, it must review the diff rather than only inspecting the final screen or API response.

The agent must:

1. Read this standard before reviewing.
2. Read the linked issue, requirement, and acceptance criteria.
3. Inspect the complete Git diff.
4. Identify affected modules and contracts.
5. Check backend, frontend, database, configuration, tests, security, and deployment impact.
6. List findings before any summary.
7. Order findings by severity.
8. Include the file path and line number for each finding.
9. Explain the impact, not only the coding preference.
10. Provide a concrete suggested fix.
11. Clearly state when no blocking issue is found.
12. Mention remaining risks and missing tests.
13. Not modify code when the request is review-only.

## 8.7 Finding Severity

Use the following severity levels:

- **Critical:** Security exposure, data loss, authentication bypass, authorization bypass, production outage, or irreversible corruption.
- **High:** Likely functional failure, broken business workflow, invalid persistence, major API mismatch, or unsafe migration.
- **Medium:** Edge-case defect, incomplete validation, performance problem, maintainability risk, or missing high-value test.
- **Low:** Readability, naming, minor consistency, or cleanup issue that does not block approval.
- **Suggestion:** Optional improvement that should not block the pull request.

## 8.8 Review Finding Format

```markdown
### [Severity] Brief finding title

**Issue:** Describe the specific problem.

**Impact:** Explain what can go wrong for users, data, security, performance, deployment, or maintainability.

**Location:** `path/to/file.ext:line`

**Suggestion:** Provide a concrete correction or implementation direction.
```

## 8.9 Approval Decision

The AI reviewer must finish with one of these decisions:

- **Approve:** No blocking issue exists, and risk-appropriate validation is complete.
- **Approve with comments:** Only non-blocking improvements remain.
- **Request changes:** One or more correctness, security, data, compatibility, or required-testing issues must be fixed.
- **Unable to verify:** Required code, diff, build output, environment, or test evidence was unavailable.


# 9. AI Agent Self-Review Before Completion

Before presenting the final implementation, the AI agent must perform a self-review and report:

## 9.1 Files Changed

List every file created, modified, or deleted.

## 9.2 Existing Pattern Followed

Mention the existing file, module, service, component, handler, endpoint, or feature used as the reference pattern.

## 9.3 Requirement Coverage

Map each implemented change to the corresponding requirement or acceptance criterion.

## 9.4 Validation Performed

Describe:

- Input validation.
- Business validation.
- Authorization validation.
- Null and edge-case handling.

## 9.5 Testing Performed

Report:

- Build result.
- Test result.
- Manual scenarios checked.
- Scenarios not tested.

## 9.6 Risks and Assumptions

Clearly state:

- Assumptions made.
- Known limitations.
- Possible regression areas.
- Required migration or deployment steps.
- Any part requiring human review.

---

# 10. Required AI Agent Completion Format

The AI agent must use the following format after completing development:

```markdown
## Implementation Summary

### Requirement
- [Brief description of the implemented requirement]

### Files Changed
- `path/to/file1`
- `path/to/file2`

### Existing Pattern Followed
- [Mention the existing feature or file used as reference]

### Backend Changes
- [Summary of .NET Core changes]

### Frontend Changes
- [Summary of Angular changes]

### Database Changes
- [Migration or schema changes, or "None"]

### Validation and Security
- [Validation, authorization, and security checks]

### Testing Performed
- [Build, tests, and manual scenarios]

### Risks and Assumptions
- [Known risks, assumptions, or limitations]

### Deployment Notes
- [Migration, configuration, or deployment steps]

### Final Self-Review
- [ ] Existing architecture followed
- [ ] Existing naming conventions followed
- [ ] No unnecessary complexity introduced
- [ ] No unrelated code modified
- [ ] Backend validation implemented
- [ ] Authorization verified
- [ ] API contract verified
- [ ] Error handling verified
- [ ] Build successful
- [ ] Tests passed
- [ ] No secrets or debug code included
```

---


# 10.1 Suggested Local Verification Commands

Run only the checks relevant to the changed files, but do not claim success unless the commands were actually executed.

## Backend

```powershell
dotnet restore src/API/CRM.sln
dotnet build src/API/CRM.sln --no-restore
```

Run applicable backend tests using the repository's existing test projects. If no test project exists for the affected module, explicitly report that limitation.

## Frontend

```powershell
cd src/ClientApp
npm install
npm run build
npm test
```

Use `npm ci` instead of `npm install` when the repository and environment support a valid lockfile-based clean installation.

## Git and Scope Review

```powershell
git status
git diff --stat
git diff
```

For staged changes:

```powershell
git diff --cached
```

The agent must inspect generated files, package-lock changes, migrations, configuration files, and deleted files before reporting completion.


# 11. Prohibited AI Agent Behavior

The AI agent must not:

- Rewrite an entire module for a small requirement.
- Replace existing architecture with a preferred architecture.
- Introduce unnecessary generic repositories.
- Introduce unnecessary base classes.
- Introduce unnecessary interfaces.
- Introduce unnecessary design patterns.
- Add a new frontend state-management library without approval.
- Add a new UI library without approval.
- Add third-party packages without approval.
- Modify unrelated files.
- Rename existing public contracts without approval.
- Remove existing validation or authorization.
- Hardcode credentials, URLs, IDs, roles, or environment values.
- Hide errors with empty catch blocks.
- Suppress warnings instead of solving the cause.
- Use `any` unnecessarily in Angular.
- Use `.Result` or `.Wait()` in .NET async code.
- Create migrations with unrelated schema changes.
- Mark work complete without reviewing build and test results.
- Claim tests passed when they were not executed.
- Claim a requirement is complete when any acceptance criterion is missing.

---

# 12. Final Approval Rule

AI-generated code must not be considered approved only because it builds successfully.

Approval requires confirmation that:

1. The requirement is correctly implemented.
2. Existing architecture and coding patterns are followed.
3. The solution is understandable by the development team.
4. Security and authorization are correctly enforced.
5. Validation exists in both the appropriate frontend and backend layers.
6. Database changes are safe.
7. API contracts are aligned.
8. Tests and manual verification are sufficient.
9. No unnecessary complexity has been introduced.
10. A human reviewer has completed the final review.

# 13. Using This Standard With an AI Agent

This file is an instruction and review standard. It is not executed automatically.

## Development Prompt

```text
Read AI_CODE_REVIEW_AND_DEVELOPMENT_STANDARD.md before making changes.

Implement the provided requirement using the existing .NET Core and Angular architecture, patterns, naming conventions, validation approach, authorization model, API response format, UI components, and styles.

Inspect similar existing implementations before writing code. Keep the change limited to the requested scope. Prefer the simplest maintainable solution. Do not introduce new libraries, architectural patterns, generic abstractions, or unrelated refactoring without explicit approval.

After implementation, build and test the affected projects where possible. Then provide the required implementation summary, list every changed file, identify the existing pattern followed, report tests actually executed, and disclose assumptions, limitations, risks, and deployment steps.
```

## Review-Only Prompt

```text
Read AI_CODE_REVIEW_AND_DEVELOPMENT_STANDARD.md first.

Review the current Git changes against the standard. Inspect the full diff and the linked requirement or acceptance criteria.

Focus on correctness, scope, architecture consistency, security, authorization, validation, API contracts, data handling, EF migrations, production_migrations.sql, Angular state and subscription handling, tests, performance, deployment safety, and maintainability.

List findings first, ordered by severity. For every finding include the file path, line number, impact, and concrete suggested fix.

Do not modify code. If no blocking issue exists, state that clearly and identify remaining risks or missing tests.
```

## Codex Terminal Example

```powershell
codex "Read AI_CODE_REVIEW_AND_DEVELOPMENT_STANDARD.md first. Review the current git changes against the standard. Inspect the complete diff. List findings first by severity with file path, line number, impact, and suggested fix. Do not modify code."
```
