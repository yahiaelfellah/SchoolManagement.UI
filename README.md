# schoolmanagementsystem.client

This template should help get you started developing with Vue 3 in Vite.

Short overview
- Frontend client for School Management System built with Vue 3, Vite and TypeScript.
- Uses Vue Router for navigation, Pinia for state management, and Axios for API calls.

Prerequisites
- Node.js 18+ (or compatible LTS)
- npm or yarn

Project setup
```sh
npm install
# or
# yarn
```

Development
```sh
npm run dev
# opens local dev server (Vite) with hot-reload
```

Type-check, build and preview
```sh
npm run typecheck     # optional: vue-tsc for type checking
npm run build
npm run preview       # preview built production bundle locally
```

Linting & formatting
```sh
npm run lint
npm run format        # if prettier is configured
```

Testing
```sh
npm run test          # if Vitest or other test runner configured
```

Environment
- Use `.env`, `.env.development`, `.env.production` for environment-specific variables.
- Typical variables: VITE_API_BASE_URL, VITE_APP_TITLE, etc.
- Do not commit secrets.

Architecture

High-level
- Single-page application (SPA) with client-side routing and component-based UI.
- Layered organization: views → layout → components → services → store.

Folder structure (src/)
- src/
  - main.ts            # app entry, global plugins (router, pinia), global styles
  - App.vue            # root component
  - assets/            # images, fonts, static assets referenced by app
  - components/        # reusable UI components (buttons, form controls)
  - layouts/           # page layouts (authenticated, public)
  - views/             # route-level views (Dashboard, Students, Classes, Login)
  - router/            # Vue Router setup and route definitions
  - store/             # Pinia stores (state management)
  - services/          # API clients, business logic wrappers (axios instances)
  - types/             # TypeScript type definitions / interfaces
  - composables/       # reusable composition functions (useAuth, useFetch)
  - utils/             # utility helpers and formatters
  - styles/            # global styles, variables, theme
  - plugins/           # plugin registration (i18n, validators)
  - tests/             # unit / integration tests

Key technologies
- Vue 3 + Composition API (TypeScript)
- Vite for dev server & build
- Vue Router for routing
- Pinia for state management
- Axios (or fetch) for HTTP requests
- ESLint + Prettier for code style
- Vitest for unit testing (optional)
- VeeValidate or similar for form validation (optional)
- i18n (optional) for translations

Conventions
- Keep route-level logic in views; keep small UI bits in components.
- Composables in `src/composables/` for shareable logic.
- API layer in `src/services/` that returns typed DTOs.
- Pinia stores in `src/store/` and keep side-effects in actions.
- Use environment variables prefixed with VITE_ for client-safe values.

Authentication & Authorization
- Implement auth via token (JWT) stored in memory + optionally refresh tokens stored in secure cookie.
- Protect routes using navigation guards in `router/index.ts`.

Error handling & UX
- Centralize API error handling in the Axios instance (interceptors).
- Show global notifications for errors/success (use a notifications store or plugin).

Building & deployment
- Build output: `dist/` (static files). Serve via any static hosting (Netlify, Vercel, GitHub Pages, Azure Static Web Apps).
- For SPAs, ensure server is configured to fallback to index.html for client-side routing.
- CI: run lint, typecheck, test and build steps on push.

Further notes
- Keep README up to date with any added scripts, tooling or environment requirements.
- Add a CONTRIBUTING.md and CODE_OF_CONDUCT.md for team onboarding if needed.

## Original quick start (kept for reference)

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).
