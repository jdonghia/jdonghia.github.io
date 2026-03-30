# donghia.dev

Latest version of my website, built with Next.js App Router, TypeScript, and Tailwind CSS.

![Page](public/imgs/root-page.png)

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- MDX (`@next/mdx` + remark plugins)

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Then open `http://localhost:3000`.

## Available Scripts

- `pnpm dev` — start local development server
- `pnpm lint` — run Next.js linting
- `pnpm build` — create a production build (configured for static export)
- `pnpm start` — run the production server

> Note: there is currently no test runner configured in this project.

## Project Structure

- `app/` — routes, layouts, and homepage sections
- `components/` — shared UI components
- `lib/` — utilities and content helpers
- `writing/` — Markdown/MDX content
- `public/` — static assets

## Content

Writing content is sourced from files in `writing/` and rendered through MDX.

The project uses these remark plugins:

- `remark-gfm`
- `remark-frontmatter`
- `remark-mdx-frontmatter`

## Build Configuration

`next.config.ts` includes:

- `output: "export"`
- `trailingSlash: true`
- `images.unoptimized: true`

This setup is suitable for static hosting.

## License

- Source code in this repository is licensed under the MIT License.
- Written content in `writing/` is licensed under CC BY-NC-ND 4.0.

See `LICENSE` for full details.
