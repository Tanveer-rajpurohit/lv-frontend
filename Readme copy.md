## Documentation Overview

Find detailed docs in the `docs/` directory:

- Auth: [docs/auth.md](docs/auth.md)
- Admin: [docs/admin.md](docs/admin.md)
- User: [docs/user.md](docs/user.md)
- Creator: [docs/creator.md](docs/creator.md)
- Changes/Release Notes: [docs/CHANGELOG.md](docs/CHANGELOG.md)

## Project Overview

LawVriksh Frontend is a Next.js 15 (App Router) application written in TypeScript. It implements authentication (email/OTP, optional 2FA, Google OAuth), user profile management, creator application workflows, admin review tooling, and basic GenAI-assisted scoring. The codebase emphasizes clear separation of concerns: API clients in `src/lib/api`, typed payloads in `src/types`, UI components in `src/components`, and feature-specific hooks/services under `src/features`.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Redux Toolkit + React Redux (planned/limited; main state managed with React Context for auth)
- TailwindCSS v4 (PostCSS plugin) and custom CSS modules

Primary dependencies (see `package.json`):

- `next@15.5.2`, `react@19.1.0`, `react-dom@19.1.0`
- `lucide-react` (icons), `framer-motion` (animations)

## Project Scripts

- `npm run dev` – start dev server (Turbopack)
- `npm run build` – build for production (Turbopack)
- `npm run start` – start production server

## Environment Setup

Environment variables are read via `process.env`. The API base URL is configured by:

- `NEXT_PUBLIC_API_BASE_URL` – defaults to `http://localhost:8000` if not set

Local storage keys used for auth and telemetry are defined in `src/constants/storage-keys.ts`.

## Directory Structure

Top-level (selected):

- `app/` – Next.js App Router pages and layouts
- `public/` – static assets
- `src/` – source code
  - `components/` – UI, layout, admin, auth, creator, user components
  - `constants/` – route paths and API endpoint constants, storage keys
  - `contexts/` – React Contexts for app-wide state (Auth, Feature Flags)
  - `features/` – feature-specific hooks/services (admin review, creator application, scoring)
  - `hooks/` – reusable hooks (debounce, local storage, protected route, sessions, admin dashboard)
  - `lib/api/` – API client and service classes (auth, admin, creator, genAI)
  - `providers/` – top-level providers (Auth, Notification)
  - `styles/` – organized CSS for areas (admin, auth, dashboard, creator, user, common)
  - `types/` – global, feature, and API typings
  - `utils/` – helpers (date, validators)
  - `workers/` – web workers (e.g., fingerprint)

## Routing (Next.js App Router)

Routes live under `app/` with nested segments:

- Public:
  - `/` → `app/page.tsx`
  - `/404` → `app/404.tsx`
- Auth group `(auth)/`
  - `/login`, `/register`, `/two-factor`
- Creator:
  - `/creator-application`
- Dashboard (protected):
  - `/dashboard` (base), with role-scoped subroutes:
    - Admin: `/dashboard/admin`, `/dashboard/admin/applications`, `/dashboard/admin/applications/[id]`, `/dashboard/admin/profile`, `/admin/users`, `/admin/logs`
    - Creator: `/dashboard/creator`, `/dashboard/creator/profile`
    - User: `/dashboard/user`, `/dashboard/user/applications`, `/dashboard/user/profile`

Global layout files: `app/layout.tsx`, `app/globals.css`; dashboard layout: `app/dashboard/layout.tsx`.

## State Management

This project uses React Context for authentication and feature flags, with future compatibility for Redux Toolkit where needed.

- `src/contexts/AuthContext.tsx`

  - Holds `user`, `tokens`, `profile`, and auth lifecycle state (`isAuthenticated`, `isLoading`, `error`).
  - Exposes actions: `login`, `signup`, `verifyOTP`, `verify2FA`, `logout`, `forgotPassword`, `resetPassword`, `enable2FA`, `disable2FA`, `UserSetup`, `getProfile`, `updateProfile`, `clearError`, `refreshUser`.
  - Handles token storage/refresh via `authService` and `localStorage`.

- `src/contexts/FeatureFlagContext.tsx`
  - Simple feature-flag toggles available app-wide.

## API Handling

Common HTTP logic is centralized in `src/lib/api/fetchClient.ts`:

- Adds `Content-Type: application/json` and `Authorization: Bearer <token>` (if present in `localStorage`).
- Base URL from `NEXT_PUBLIC_API_BASE_URL`.
- Returns typed `APIResponse<T>` and throws on non-OK status with error message.

Service layers encapsulate endpoints and payloads:

- `authService.ts` – signup/login/OTP/2FA/session management/profile operations; Google OAuth helpers.
- `adminService.ts` – admin dashboard, system stats, creator applications list/detail, review endpoints.
- `creatorService.ts` – creator-specific operations (apply, list my applications, eligibility).
- `genAiService.ts` – scoring and risk-evaluate endpoints.

Constants in `src/constants/routes.ts` define both client-side `ROUTES` and `API_ENDPOINTS` consumed by services.

## Features

- Admin Review (`src/features/admin-review`)

  - Hook: `hooks/useCreatorApplications.ts` – query, filter, paginate creator applications.

- Creator Application (`src/features/creator-application`)
  - Hook: `hooks/useCreator.ts` – eligibility checks, application submission, and current user applications.

## UI and Components (`src/components`)

- Layout: `AppShell.client.tsx`, `Dashboard.client.tsx`, `Sidebar.client.tsx`, `Topbar.client.tsx`
- Admin: `AdminPanel.tsx`, `ReviewPanel.tsx`, `UsersList.tsx`, `LogsComp.tsx`
- Auth: `Login.client.tsx`, `Signup.client.tsx`, `OTPForm.client.tsx`, `TwoFAForm.client.tsx`, `UserSetupForm.client.tsx`, `PasswordSetupForm.client.tsx`, `InterestForm.tsx`, `ProfessionForm.client.tsx`, `ProtectedRoute.tsx`
- Creator: `CreatorApplicationForm.tsx`, `CreatorApplication.Client.tsx`, `UserApplications.Client.tsx`
- User: `Profile.client.tsx`, `ProfileUpdateForm.client.tsx`
- UI kit: `Button.tsx`, `Icon.tsx`, `Input.tsx`, `Loader.tsx`, `Modal.tsx`, `ProgressBar.tsx`

## Styles (`src/styles`)

Organized by domains: `admin-styles`, `auth-styles`, `creator-styles`, `dashboard-styles`, `user-styles`, `common-styles` (e.g., `top-bar.css`, `home.css`). TailwindCSS v4 is available alongside vanilla CSS files.

## Constants (`src/constants`)

- `routes.ts` – `ROUTES` for client navigation and `API_ENDPOINTS` for services.
- `storage-keys.ts` – keys for `localStorage` persistence: tokens, user data, remember-me, device fingerprint, registration timers.

## Types (`src/types`)

Typed contracts for API requests/responses and domain models:

- `auth.d.ts` – auth models, tokens, sessions, profile types, requests/responses.
- `admin.d.ts`, `application.admin.d.ts` – admin dashboard, system stats, creator application listings and review payloads.
- `creator.d.ts` – creator domain models.
- `genai.d.ts` – scoring/risk evaluate payloads.
- `index.ts` – barrels for shared exports.

## Hooks (`src/hooks`)

- `useAdminDashboard.ts` – derives admin dashboard state for UI.
- `useDebounce.ts` – general debouncing utility.
- `useLocalStorage.ts` – typed wrapper for localStorage state.
- `useProtectedRoute.ts` – guards pages based on authentication.
- `useSessionManagement.ts` – access and manage user sessions.

## Providers (`src/providers`)

- `AuthProvider.client.tsx` – wraps the app with `AuthContext` and initializes auth state.
- `NotificationProvider.client.tsx` – global toasts/notifications.

## Utilities (`src/utils`)

- `date.ts` – date/time formatting helpers.
- `validators.ts` – common form validation utilities.

## Web Workers (`src/workers`)

- `fingerprint.worker.ts` – captures device/browser fingerprinting data for security/analytics.

## Error Handling and Loading

- Network errors are thrown by `FetchClient.makeRequest` with meaningful messages from the backend when available.
- UI-level loading and error states are represented via `Loader` and contextual messages in pages/components.

## Security and Auth Flows

- Tokens stored in `localStorage` (`ACCESS_TOKEN`, `REFRESH_TOKEN`). Access token is attached as `Authorization: Bearer ...`.
- Background refresh handled in `AuthContext` on an interval; invalid/expired tokens trigger a logout and redirect to `/login`.
- Optional 2FA and OTP flows are supported via dedicated endpoints.
- Google OAuth helper methods for auth URL and callback handling.

## Coding Conventions

- Keep API concerns in `src/lib/api` and do not call `fetch` directly from components.
- Use types from `src/types` for all network payloads and UI models.
- Components under `src/components` are presentational where possible; compose via feature hooks/services.
- Co-locate feature-specific hooks/services under `src/features/<feature>`.
- Reuse constants from `src/constants` to avoid hardcoded paths/URLs.

## Quick Start

Prerequisites:

- Node.js 20+ and npm 10+

Install dependencies:

- npm install

Create environment file (optional):

- Copy `.env.local.example` (see below) to `.env.local` and set values.

Run the app in development:

- npm run dev

Build and run production:

- npm run build
- npm run start

Project opens at http://localhost:3000

## Environment Variables

At minimum:

- NEXT_PUBLIC_API_BASE_URL – Base URL for your backend API

Example `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## API Usage Examples

All requests are made through the `FetchClient` with `Authorization: Bearer <token>` automatically attached when tokens are present in `localStorage`.

Auth:

- Signup: POST /auth/signup { email }
- Verify OTP (and set password): POST /auth/verify-otp { email, otp, password }
- Login: POST /auth/login { email, password }
- Verify 2FA: POST /auth/verify-2fa { email, otp }
- Logout: POST /auth/logout
- Sessions: GET /auth/sessions

Profile:

- Get current user: GET /users/profile
- Update profile (partial): PATCH /users/profile

Creator:

- Eligibility: GET /users/creator/eligibility
- Apply: POST /users/creator/apply
- My applications: GET /users/creator/application

Admin:

- Dashboard: GET /admin/dashboard
- Stats: GET /admin/stats
- List applications: GET /admin/applications?status=pending&skip=0&limit=20
- Application by id: GET /admin/applications/:id
- Review application: PUT /admin/applications/:id/review { status, review_notes? }

See `src/lib/api` service files and `src/constants/routes.ts` for the authoritative endpoints list.

## Contributing

Code style and structure:

- Keep API code in `src/lib/api` and use the service layer from components.
- Use strict TypeScript types from `src/types`.
- Prefer small, focused React components and encapsulate feature logic in `src/features/<feature>` hooks/services.
- Respect existing folder naming and domain-based CSS organization under `src/styles`.

PR checklist:

- Add/adjust types for any new endpoints or models.
- Update `src/constants/routes.ts` if you introduce new endpoints or routes.
- Include loading/error states in UI changes (use `Loader` where applicable).
- Update this README if architectural conventions or directories change.

Testing manual flows to verify:

- Auth: signup → OTP verify → login → optional 2FA → profile update.
- Creator: eligibility check → submit application → view my applications.
- Admin: view dashboard and stats → list applications → open detail → review approve/reject.

## FAQ

Q: Where do I set the API base URL?

- A: In `.env.local` via `NEXT_PUBLIC_API_BASE_URL`.

Q: Where are auth tokens stored?

- A: In `localStorage` using keys from `src/constants/storage-keys.ts`. The `AuthContext` manages storage and refresh.

Q: How do I add a new API endpoint?

- A: Add a constant in `src/constants/routes.ts`, then create a typed wrapper in the appropriate service (e.g., `authService`, `adminService`). Consume that in a hook/component.

Q: Does the app use Redux Toolkit?

- A: Primary global state is via `AuthContext`. Redux Toolkit can be adopted for complex domains; earlier admin docs refer to Redux patterns and can be reintroduced if needed.

## New Documentation (2025-09-30)

- Writing Section: see [docs/writing-section.md](docs/writing-section.md)
- Document Upload: see [docs/document-upload.md](docs/document-upload.md)
- Full changelog: see [docs/CHANGELOG.md](docs/CHANGELOG.md)

### Environment

Update your .env based on .env.example:

- NEXT_PUBLIC_API_BASE_URL (required)
- NEXT_PUBLIC_WS_URL_GRAMMER_SPELL (optional; enable live progress if using WebSockets)

### Routes

- Added COMMON_ROUTES.WRITING_SECTION = /writing-section
- Dynamic page: app/writing-section/[projectId]/page.tsx
