# Commit message convention

Every commit **subject line** (the first line of the message) must match:

```text
<type>: <short description>
```

- **`<type>`** is one of the allowed keywords below (lowercase).
- **Colon + space** (`: `) after the type is required.
- **`<short description>`** must be non-empty (what changed, imperative mood is recommended, e.g. “add login form”).

### No co-authors

Do **not** add `Co-authored-by`, `Co-Authored-By`, or any other co-author trailer to commit messages. Commits must list only the human author. Tools (including AI assistants) must not append co-author lines.

Examples:

```text
feat: add employee dashboard shell
fix: correct dark mode token for borders
docs: document Husky and commit hooks
```

## Allowed types

| Type       | When to use                                |
| ---------- | ------------------------------------------ |
| `feat`     | New feature                                |
| `fix`      | Bug fix                                    |
| `docs`     | Documentation only                         |
| `style`    | Formatting / UI style (no logic change)    |
| `refactor` | Code restructure without behavior change   |
| `perf`     | Performance improvement                    |
| `test`     | Add or update tests                        |
| `build`    | Build system or dependency changes         |
| `ci`       | CI/CD configuration changes                |
| `chore`    | Other maintenance (tooling, configs, etc.) |
| `revert`   | Revert a previous commit                   |

## Enforcement

[Husky](https://typicode.github.io/husky/) runs **`.husky/commit-msg`**, which executes `scripts/verify-commit-message.mjs`. If the subject line does not match the rule, **`git commit` is rejected**. Any `Co-authored-by` trailer injected by tools is **stripped automatically** before the commit is recorded.

### Exceptions

- **Merge commits** whose first line starts with `Merge ` are allowed (Git’s default merge messages).

### Full message (optional body)

After the subject line you can add a blank line and a longer body; only the **first line** is validated for the `type: description` pattern.

```text
feat: add chat streaming

Stream tokens as they arrive from the API.
Update loading state when the stream ends.
```

## Reference

Implementation: `scripts/verify-commit-message.mjs`.
