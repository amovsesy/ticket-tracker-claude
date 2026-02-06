# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A desktop-first SvelteKit web application for tracking event ticket prices across major US ticketing platforms (StubHub, Ticketmaster, SeatGeek) with price drop notifications. The app uses Cloudflare for deployment, Clerk for authentication, Drizzle ORM with PostgreSQL for database, and integrates Sentry for error monitoring and Statsig for feature flags and analytics.

## Key Commands

### Development

```bash
pnpm run dev              # Start development server
pnpm run dev -- --open    # Start dev server and open browser
pnpm run build            # Build for production
pnpm run preview          # Build and preview with Wrangler (Cloudflare)
```

### Database (Drizzle)

```bash
pnpm run db:push         # Push schema changes to database
pnpm run db:generate     # Generate migration files
pnpm run db:migrate      # Run migrations
pnpm run db:studio       # Open Drizzle Studio (database GUI)
```

### Testing

```bash
pnpm run test:unit       # Run Vitest unit tests (interactive)
pnpm run test:unit -- --run  # Run unit tests once
pnpm run test:e2e        # Run Playwright end-to-end tests
pnpm run test            # Run all tests (unit + e2e)
```

### Code Quality

```bash
pnpm run lint            # Check formatting (Prettier) and lint (ESLint)
pnpm run format          # Auto-format all files with Prettier
pnpm run check           # Type-check with svelte-check
pnpm run check:watch     # Type-check in watch mode
```

### Deployment

```bash
pnpm run deploy          # Build and deploy to Cloudflare
pnpm run cf-typegen      # Generate Cloudflare Worker types
```

## Architecture

### Tech Stack

- **Framework**: SvelteKit 2 with Svelte 5 (using runes)
- **Deployment**: Cloudflare Pages/Workers (adapter-cloudflare)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk (custom Svelte integration in `src/lib/components/clerk/`)
- **Styling**: Tailwind CSS 4
- **Feature Flags**: Statsig (with session replay and analytics)
- **Error Tracking**: Sentry
- **Testing**: Vitest (unit/component), Playwright (e2e)

### Project Structure

```
src/
├── lib/
│   ├── components/
│   │   └── clerk/           # Custom Clerk Svelte components
│   ├── server/
│   │   ├── db/
│   │   │   ├── schema.ts    # Drizzle schema definitions
│   │   │   └── index.ts     # Database connection
│   │   ├── handleClerk.ts   # Server-side Clerk auth hook
│   │   └── session.ts       # Session verification utilities
│   ├── statsig.ts           # Statsig client initialization
│   └── utils.ts             # Shared utilities
├── routes/
│   ├── (app)/               # Route group for app pages (about, login, etc.)
│   ├── [...path]/           # Catch-all route (returns 404)
│   └── +layout.svelte       # Root layout
├── hooks.server.ts          # SvelteKit server hooks (Sentry integration)
├── hooks.client.ts          # Client-side hooks
└── instrumentation.server.ts # Sentry instrumentation
```

### Authentication Flow

- **Custom Clerk Integration**: This project uses a custom Clerk implementation for Svelte (not an official package)
- **Components**: Located in `src/lib/components/clerk/` include `SignIn`, `SignUp`, `SignedIn`, `SignedOut`, and auth buttons
- **Server-side**: `handleClerk()` function in `src/lib/server/handleClerk.ts` verifies sessions via cookies (`__session`)
- **Protected Routes**: Configure in `hooks.server.ts` by passing `protectedPaths` array to `handleClerk()`
- **Session Store**: Uses Svelte stores (`src/lib/components/clerk/store.ts`) to manage Clerk client state

### Database

- **Schema**: Defined in `src/lib/server/db/schema.ts` using Drizzle ORM
- **Connection**: Database URL configured via `DATABASE_URL` environment variable
- **Migrations**: Use `pnpm run db:generate` to create migrations, then `pnpm run db:push` to apply

### Environment Variables

Key environment variables (configure in `.dev.vars` for local development):

- `DATABASE_URL` - PostgreSQL connection string
- `CLERK_SECRET_KEY` - Clerk secret key for server-side auth
- `PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for client
- `PUBLIC_STATSIG_SDK_KEY` - Statsig SDK key
- `PUBLIC_STATSIG_TIER` - Environment tier for Statsig
- Sentry DSN configured via `instrumentation.server.ts`

### Testing Strategy

- **Unit Tests**: Vitest with Playwright browser provider for Svelte component tests (`.svelte.spec.ts` or `.svelte.test.ts`)
- **Server Tests**: Node environment for server-side code (`.spec.ts` or `.test.ts` in non-Svelte files)
- **E2E Tests**: Playwright tests in `e2e/` directory
- **Configuration**: Separate test projects in `vite.config.ts` for client (browser) and server (node) tests

### Cloudflare Deployment

- Uses `@sveltejs/adapter-cloudflare` with experimental tracing and instrumentation enabled
- Build output targets Cloudflare Workers runtime
- Preview with `pnpm run preview` runs Wrangler dev server
- Worker type definitions in `src/worker-configuration.d.ts` (auto-generated via `pnpm run cf-typegen`)

### Code Quality Tools

- **Prettier**: Code formatting with Tailwind CSS and Svelte plugins
- **ESLint**: Using flat config with TypeScript and Svelte support
- **Husky + lint-staged**: Pre-commit hooks auto-format and lint staged files
- **TypeScript**: Strict mode enabled via `tsconfig.json`

## Common Patterns

### Adding a New Page

1. Create route in `src/routes/` (use `(app)` route group for public pages)
2. Use `+page.svelte` for the page component
3. Use `+page.server.ts` for server-side data loading if needed
4. Protected routes are configured in `hooks.server.ts`

### Database Changes

1. Update schema in `src/lib/server/db/schema.ts`
2. Run `pnpm run db:generate` to create migration
3. Run `pnpm run db:push` to apply to database

### Feature Flags

- Initialize Statsig client in browser using `initializeStatsigForBrowser()` from `src/lib/statsig.ts`
- Includes session replay and auto-capture analytics plugins

### Error Handling

- Sentry automatically captures errors via `@sentry/sveltekit` integration
- Server instrumentation configured in `instrumentation.server.ts`
- Error boundaries can use `+error.svelte` files
