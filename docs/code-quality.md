# Code Quality Setup

This project is configured with automated code quality checks using ESLint, Prettier, and Git hooks.

## Features

### Pre-commit Hooks

- **Auto-fix ESLint errors**: Automatically fixes linting issues when possible
- **Auto-format code**: Applies Prettier formatting to staged files
- **Prevent commits with unfixable lint errors**: Blocks commits if there are linting errors that cannot be auto-fixed

### Pre-push Hooks

- **TypeScript compilation check**: Ensures all TypeScript code compiles without errors
- **Full ESLint check**: Runs ESLint on the entire codebase before pushing

### File Types Processed

- **TypeScript/React files** (`.ts`, `.tsx`): ESLint + Prettier
- **JavaScript files** (`.js`, `.jsx`): ESLint + Prettier
- **Other files** (`.json`, `.css`, `.scss`, `.md`): Prettier only

## Available Scripts

```bash
# Development linting and formatting
npm run lint              # Check for linting errors
npm run lint:fix          # Fix auto-fixable linting errors
npm run format            # Format all files with Prettier
npm run format:check      # Check if files are properly formatted

# The pre-commit hooks will automatically run:
npm run lint:fix          # on staged .ts/.tsx/.js/.jsx files
npm run format            # on staged files
```

## Configuration Files

- **`.lintstagedrc.json`**: Defines which commands run on staged files
- **`.husky/pre-commit`**: Runs lint-staged before commits
- **`.husky/commit-msg`**: Validates commit message format
- **`.husky/pre-push`**: Runs full checks before pushing
- **`.prettierrc`**: Prettier configuration
- **`.prettierignore`**: Files/directories excluded from formatting
- **`eslint.config.js`**: ESLint configuration

## Workflow

1. **Make changes** to your code
2. **Stage files** with `git add`
3. **Commit** with `git commit -m "message"`
    - Pre-commit hook automatically fixes and formats staged files
    - If there are unfixable lint errors, commit is blocked
    - You'll need to fix the errors manually and try again
4. **Push** with `git push`
    - Pre-push hook runs TypeScript compilation and full ESLint check
    - Push is blocked if there are any errors

## Bypassing Hooks (Emergency Only)

```bash
# Skip pre-commit hooks (not recommended)
git commit -m "message" --no-verify

# Skip pre-push hooks (not recommended)
git push --no-verify
```

⚠️ **Warning**: Only bypass hooks in emergency situations. Always fix the underlying issues.
