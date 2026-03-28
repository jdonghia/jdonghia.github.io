# AGENTS.md

Repository guidance for agentic coding tools working in this project.

## Project Context

- Framework: Next.js 15 (App Router) with React 19.
- Language: TypeScript (`strict: true`).
- Styling: Tailwind CSS 4.
- Content: MDX enabled (`@next/mdx`, remark plugins).
- Package manager: `pnpm`.
- Build target: static export (`output: "export"` in `next.config.ts`).

## Build / Lint / Test Commands

### Development

- `pnpm dev`
  - Runs Next.js in development mode.

### Linting

- `pnpm lint`
  - Runs `next lint` from `package.json`.
  - Use this as the first validation step after edits.

### Production build

- `pnpm build`
  - Runs `next build`.
  - Project is configured for static export style output.

### Production run

- `pnpm start`
  - Runs production server from built artifacts.

### Tests

- Current status: no test script and no configured test framework in `package.json`.
- `pnpm test` is not available right now.

### Running a single test (important)

- Not currently possible in this repo because no test framework is configured.
- Do not assume Jest/Vitest/Playwright commands.
- If tests are introduced later, add exact commands here, e.g.:
  - `pnpm test -- path/to/file.test.ts`
  - `pnpm test -- -t "case name"`

## Recommended Validation Flow for Agents

For non-trivial changes, run:

1. `pnpm lint`
2. `pnpm build`
3. If tests are later added, run targeted single-test command first, then broader suite.

Do not claim tests pass unless a real test script exists and was run.

## Repository Structure

- `app/`: Next.js App Router routes, layouts, and section components.
- `components/`: shared React components.
- `lib/`: utility and content helpers.
- `writing/`: markdown/MDX content files.
- `app/globals.css`: global styling.

## Code Style Guidelines

### Formatting and whitespace

- Use Prettier formatting from `.prettierrc`.
- Plugins in use:
  - `prettier-plugin-tailwindcss`
  - `prettier-plugin-organize-imports`
- Keep line width near configured `printWidth: 140`.
- Keep prose wrapping behavior consistent with `proseWrap: "always"`.
- Prefer double quotes to match existing codebase conventions.

### Imports

- Prefer root alias imports with `@/*` instead of deep relative paths.
- Example: `import { cn } from "@/lib/utils"`.
- Keep side-effect imports explicit (e.g., CSS imports).
- Let formatter/plugins organize import order; avoid manual sorting churn.

### TypeScript and typing rules

- Preserve `strict` mode guarantees.
- Avoid `any`; use specific types whenever possible.
- If `any` is unavoidable, keep it local and minimal.
- Add explicit return types for exported functions and non-trivial helpers.
- Prefer narrow unions and literal types over broad primitives where useful.
- Use type predicates when filtering arrays that need narrowing.
- Use `PropsWithChildren` or explicit `children` typing when appropriate.

### React and Next.js conventions

- Default to server components; add `"use client"` only when required.
- Use Next.js primitives already used in repo (`next/link`, `next/font/google`).
- Keep components small and composable.
- Favor clear prop APIs and predictable rendering behavior.
- Follow existing App Router layout/segment patterns.

### Component props patterns

- For element wrappers, prefer `React.ComponentPropsWithoutRef<"tag">`.
- Name prop types/interfaces with `Props` suffix.
- Destructure props in parameter list and forward `...props` where needed.
- Use `cn()` utility to compose conditional class names.

### Naming conventions

- `PascalCase`: components, interfaces, types.
- `camelCase`: variables, functions, hooks.
- Hooks must start with `use`.
- Prefer `kebab-case` file names for new files unless folder pattern dictates otherwise.
- Avoid large-scale renames unless explicitly requested.

### Styling conventions

- Tailwind utility classes are the default styling method.
- Reuse existing visual tokens/patterns from current code.
- Keep class strings readable; use `cn()` for conditional branches.
- Do not bypass Tailwind sorting plugin conventions.

### Error handling and control flow

- Prefer guard clauses and early returns.
- Avoid deeply nested conditionals.
- Use optional chaining for nullable values.
- Validate data before access (arrays, optional objects, route params).
- Surface actionable errors where failures matter.

### MDX/content rules

- MDX is enabled in `next.config.ts`.
- Active remark plugins:
  - `remark-gfm`
  - `remark-frontmatter`
  - `remark-mdx-frontmatter`
- Keep content under `writing/` and preserve frontmatter compatibility.

## Cursor / Copilot Instructions Check

Checked for repository-level editor/agent rule files:

- `.cursor/rules/`: not found
- `.cursorrules`: not found
- `.github/copilot-instructions.md`: not found

If these files are added later, treat them as first-class instructions and reconcile this file accordingly.
