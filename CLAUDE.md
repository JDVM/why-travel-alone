# Why Travel Alone: web app

React 18 + TypeScript (strict) + Vite + Material UI 9. Travelers find each other, plan trips and invite people along. The API lives in a separate repo, [why-travel-alone-api](https://github.com/JDVM/why-travel-alone-api), checked out **next to this one** (`../why-travel-alone-api`); Docker Compose and CI rely on that layout.

## Commands

Node 22 (`.nvmrc`).

| Command | What it does |
| --- | --- |
| `npm start` | Dev server on http://localhost:3000 (use `localhost`, not `127.0.0.1`: the session cookie depends on it) |
| `npm run lint` | ESLint, `--max-warnings=0` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit and component tests |
| `npm run build` | Production build into `build/` |
| `npm run e2e` | Playwright against the full stack (below) |

Run lint, typecheck, test and build before every push; CI runs all of them plus the browser tests and a container smoke test.

### Full stack and browser tests

```sh
cd ../why-travel-alone-api
APP_SECRET=$(openssl rand -hex 32) TRUST_PROXY=1 docker compose --profile web up -d --build
cd ../why-travel-alone
npx playwright install chromium   # once
npm run e2e
```

- The stack runs the production nginx build of this app, the API, MySQL and Mailpit (emails at http://localhost:8025).
- After changing this app, rebuild the web container (`docker compose --profile web up -d --build web` from the API folder) before running e2e.
- "Too many attempts" during repeated local runs is the API's in-memory rate limit: `docker restart why-travel-alone-api-api-1` resets it.
- The `phone` project only runs tests tagged `@mobile`.

## Layout

- `src/pages/<Name>/`, `src/components/<Name>/`: one folder per page or component.
- `src/api/`: axios calls. Raw JSON is typed with `Wire<T, K>` and normalized (MySQL 0/1 → boolean) before it reaches components; `src/types.ts` holds the clean types.
- `src/auth/AuthContext.tsx`: session state (cookie-based; the browser never sees the session id).
- `src/theme.ts`: the whole look (palette in `brand`, Nunito, component overrides).
- `src/App.tsx`: routes. Every page except Login and Home is `React.lazy` loaded through `reloadIfStale` (`src/staleChunks.ts`), which reloads once if a chunk vanished after a release.
- `e2e/`: Playwright. Shared helpers in `e2e/support/stack.ts` (`createUser`, `logIn`, `logOut`, `createTrip`, `card`, `pickFrom`, …).
- `.claude/agents/`: specialist guides (css, react, typescript, vitest, playwright). Read the relevant one before larger changes.

## Conventions

- **TypeScript strict, no `any`** (ESLint enforces it). New files are `.ts`/`.tsx`.
- **Material UI only.** Style with `sx` and theme values. No Sass, CSS files, Tailwind or CSS Modules. Use `brand.*` only where a colour has no theme role.
- **No class names for tests.** Tests find elements by role and label, so keep the semantics: card grids are `ul`/`li` lists, page sections are labelled regions, labelled values are `role="group"` with `aria-labelledby`. Plain text with no role may get a `data-testid` (only the header account name has one).
- **Accessibility is tested.** `e2e/accessibility.spec.ts` runs axe (WCAG 2.1 AA) on every page, desktop and phone. Visible text must be part of a control's accessible name; keep contrast at AA.
- **Content-Security-Policy is strict** (`nginx/default.conf.template`): scripts, fonts and images from this site only; styles only from this site or `<style>` tags carrying the per-response nonce, which Emotion adds (`src/styleCache.ts`). Don't load anything from other sites or add inline scripts.
- **Forms:** `TextField`; required fields use `slotProps={{ htmlInput: { required: true } }}` (native validation, no asterisk). Long lists use `Autocomplete`.
- **Loading states:** `LoadingCards` / `LoadingPanel` from `src/components/Loading/`, never "Loading…" text.
- **Comments** explain why, in plain sentences. Match the surrounding code's style.

## Workflow

- One pull request per change, with a short summary and what was tested. Merge once CI passes ("merge each when verified").
- A change spanning both repos uses the **same branch name** in each: each repo's CI tests against the other's branch of that name (else `main`). Merge the API PR first, then this one.
- The browser console must stay clean: any console error, including a CSP violation, fails an e2e test.

## Still to do

- Move the last few direct `brand.*` uses in components into named theme colours.
- Landing page copy (`src/pages/Landing/Landing.tsx`) is a first draft.
- Before launch, see the checklist in the API repo's `DEPLOYMENT.md` (legal review, `DraftNotice` removal, real addresses).
