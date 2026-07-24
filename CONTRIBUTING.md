# Contributing to PagePulse

Thank you for your interest in contributing to PagePulse! We welcome help from the community to make this website auditing tool even better.

To maintain code quality and repository hygiene, please follow these guidelines when contributing.

---

## Code of Conduct

By participating in this project, you agree to abide by the terms of our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Getting Started

1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Clone Locally**:
   ```bash
   git clone https://github.com/Silentboy07A/Pagepulse.git
   cd pagepulse
   ```
3. **Set Up Environments**:
   - Follow the setup guidelines in the [README.md](README.md) for both the frontend and backend.
4. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Branch Naming Conventions

To keep history clear, use the following prefixes for branch names:
- `feature/` - For new features or enhancements (e.g., `feature/database-history`)
- `bugfix/` - For resolving issues or errors (e.g., `bugfix/alt-tag-parser`)
- `docs/` - For documentation changes (e.g., `docs/api-update`)
- `refactor/` - For cleaning up code structure without behavioral changes

---

## Coding Style Rules

### Frontend (React & TypeScript)
- Follow standard TypeScript types. Do not use `any` type variables unless absolutely necessary.
- Format style layout configurations using **Tailwind CSS**.
- Keep React components modular and functional.

### Backend (FastAPI & Python)
- Adhere to **PEP8** standards.
- Enforce strict type annotations on all function parameters and return types.
- Ensure all business logic metrics checks are documented with concise docstrings.

---

## Commit Message Guidelines

We use conventional commit messages to make the history readable. Format messages as:
```text
<type>(<scope>): <short description>
```

### Allowed Types:
- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Code style adjustments (white-space, formatting, missing semi-colons, etc.)
- `refactor` - A code change that neither fixes a bug nor adds a feature
- `test` - Adding missing tests or correcting existing tests
- `chore` - Changes to the build process or auxiliary tools

### Examples:
- `feat(analyzer): parse canonical tag references`
- `fix(ui): adjust word count badge alignment in dark mode`
- `docs(readme): add installation guidelines for macOS users`

---

## Pull Request Guidelines

1. **Update Documentation**: Ensure README or docs files are updated if you modify configurations or variables.
2. **Run Tests**: Verify that both backend tests pass (`pytest`) and the frontend builds cleanly (`npm run build`) before pushing.
3. **Write Clear Descriptions**: Describe the changes, why they are needed, and how they were verified.
4. **Single Concerns**: Keep pull requests focused on a single concern. If you have multiple unrelated changes, submit separate PRs.
