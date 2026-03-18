# Herb Garden Project Overview

Herb Garden is a production-ready, localized ecommerce platform built with **Payload CMS (v3)** and **Next.js (v15)**. It features a robust backend for managing products, categories, pages, and orders, with a modern, responsive frontend.

## Core Technologies
- **CMS**: [Payload CMS v3](https://payloadcms.com/)
- **Frontend**: [Next.js v15](https://nextjs.org/) (App Router), React v19
- **Database**: [MongoDB](https://www.mongodb.com/) (via `@payloadcms/db-mongodb`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Rich Text**: [Lexical Editor](https://payloadcms.com/docs/rich-text/lexical)
- **Storage**: AWS S3 (via `@payloadcms/storage-s3`)
- **Email**: [Resend](https://resend.com/) (via `@payloadcms/email-resend`)
- **Payments**: Custom Cash on Delivery adapter (Stripe dependencies present but CoD is the primary method)
- **Localization**: English (`en`) and Macedonian (`mk`)

## Project Structure
- `src/app`: Next.js App Router containing both the frontend and the Payload admin panel.
- `src/collections`: Payload collection definitions (`Users`, `Pages`, `Categories`, `Media`, `Products`).
- `src/globals`: Global data structures (`Header`, `Footer`).
- `src/blocks`: Reusable layout building blocks (Hero, Content, Call To Action, etc.).
- `src/access`: Access control logic for roles (`admin`, `customer`).
- `src/plugins`: Payload plugin configurations (SEO, Form Builder, Ecommerce, S3).
- `src/payments`: Payment adapters, including custom Cash on Delivery logic.
- `tests/`: Automated tests (Vitest for integration, Playwright for E2E).

## Building and Running

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.20.2 or >=20.9.0)
- [pnpm](https://pnpm.io/)
- MongoDB instance
- Environment variables configured (see `.env.example`)

### Commands
- **Install dependencies**: `pnpm install`
- **Development mode**: `pnpm dev` (runs with Turbopack)
- **Production build**: `pnpm build`
- **Start production server**: `pnpm start`
- **Run tests**: `pnpm test` (runs both integration and E2E)
- **Run integration tests**: `pnpm test:int`
- **Run E2E tests**: `pnpm test:e2e`
- **Generate TypeScript types**: `pnpm generate:types`
- **Linting**: `pnpm lint` (or `pnpm lint:fix` to auto-fix)

## Development Conventions

### Coding Style
- **TypeScript**: Use strict typing. Ensure `pnpm generate:types` is run after schema changes.
- **Components**: Prefer functional components with React Hooks. Use `shadcn/ui` for UI primitives.
- **Styling**: Use Tailwind CSS utility classes. Custom theme variables are defined in `tailwind.config.mjs` and mapped to HSL CSS variables.
- **Payload Config**: Keep collection and global definitions modular in `src/collections` and `src/globals`.

### Access Control
- Default roles: `admin` and `customer`.
- Use the utility functions in `src/access` (e.g., `isAdmin`, `isDocumentOwner`) to enforce security.

### Localization
- Always provide translations for both `en` and `mk`.
- Use the Payload `localization` config for CMS data and Next.js internationalization for the frontend.

### Email & Notifications
- Email templates are located in `src/utilities/emails`.
- Hooks in `src/plugins/index.ts` handle automatic notifications for order status changes.

### Storage
- Media is stored in S3. Ensure `S3_` environment variables are correctly set for local development if media uploads are required.

## Key Files
- `src/payload.config.ts`: Main Payload CMS configuration.
- `src/plugins/index.ts`: Central hub for Payload plugins and their customizations.
- `src/payments/cashOnDelivery.ts`: Implementation of the primary payment method.
- `tailwind.config.mjs`: Tailwind CSS configuration and theme extensions.
- `next.config.js`: Next.js configuration including image domains and redirects.
