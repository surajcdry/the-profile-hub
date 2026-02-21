# Profile Hub — Project Memory

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (uses `@import "tailwindcss"` + `@theme inline`)
- NextAuth v5 beta (next-auth@5.0.0-beta.30) with PrismaAdapter
- Prisma v7 with @prisma/adapter-pg (serverless-compatible via Neon)
- pnpm package manager

## Design System
- **Accent color**: violet-600 (#7C3AED), hover: violet-700
- **Text**: zinc-900 (primary), zinc-500 (secondary), zinc-400 (tertiary)
- **Backgrounds**: white / zinc-50
- **Cards**: `bg-white border border-zinc-200 rounded-2xl shadow-sm`
- **Primary button**: `bg-violet-600 hover:bg-violet-700 text-white rounded-xl`
- **Secondary button**: `border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl`
- **Inputs**: focus ring uses `focus:border-violet-400`

## Key Files
- `src/components/Logo.tsx` — SVG logo (hub icon + text)
- `src/components/QRCodeButton.tsx` — QR code modal (uses `qrcode` npm package)
- `src/components/ProfileCard.tsx` — Member profile card
- `src/components/HomeClient.tsx` — Landing page (client component)
- `src/app/actions/createList.ts` — Has retry logic for duplicate code collisions

## Auth Routes
- Sign-in page: `/sign-in` (custom, NOT /api/auth/signin)
- Always redirect to `/sign-in?callbackUrl=...` not `/api/auth/signin`

## Patterns
- Server pages use `await auth()` + `redirect("/sign-in?callbackUrl=...")` for auth guard
- Prisma error P2002 = unique constraint violation
- URL construction: use `headers().get("x-forwarded-proto")` for proxy-safe protocol detection
- Test files (`test-adapter.ts`, `test-adapter-2.ts`) are excluded in tsconfig.json
