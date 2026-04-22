# FidelAmharic

FidelAmharic is a full-stack Amharic learning website built by Amir Abaraya with Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and NextAuth.

## Author

Built by Amir Abaraya.

## Links

- Live site: https://fidelamharic.vercel.app
- GitHub: https://github.com/amirabaraya/fidelamharic

## Features

- Premium Ethiopian-inspired brand system with Ge'ez-focused visual language
- Responsive landing page plus authenticated app screens
- Dashboard, course map, lesson, practice, review, leaderboard, profile, settings, and admin content panel
- Gamified XP, streaks, hearts, badges, daily goals, progress tracking, flashcards, and spaced repetition UI
- English-to-Amharic and Amharic-to-English exercise models
- Pronunciation, listening, reading, writing, and vocabulary drill surfaces
- Dark mode, keyboard focus states, reduced motion support, and accessible labels
- Prisma schema for users, auth, units, lessons, exercises, progress, review cards, and badges

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment example:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL` to a PostgreSQL database and set a secure `NEXTAUTH_SECRET`.

4. Prepare the database and sample content:

```bash
npm run db:push
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

Demo credentials seeded by `npm run db:seed`:

- Email: `maya@example.com`
- Password: `fidelamharic-demo`

## Deployment

FidelAmharic is ready for a serverless Next.js host such as Vercel. Configure these production environment variables before deploying:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_MONTHLY_PRICE_ID`
- `STRIPE_ANNUAL_PRICE_ID`

After the production database is available, run:

```bash
npm run db:push
npm run db:seed
```

The app uses browser speech synthesis and speech recognition for practice. Speech playback works in modern browsers; microphone recognition is best supported in Chrome and Edge.

## Payments

Payments use Stripe Checkout subscriptions. Create a Stripe account owned by Amir Abaraya, finish Stripe payout and bank onboarding, then create two recurring Prices in the Stripe Dashboard: monthly and annual. Add those Price IDs and your Stripe secret/webhook keys to Vercel. Payments are received by the Stripe account connected to `STRIPE_SECRET_KEY`.

The webhook endpoint is:

```text
https://fidelamharic.vercel.app/api/stripe/webhook
```

Listen for at least `checkout.session.completed` in Stripe so subscriptions are recorded in the database.

## Pages

- `/` Landing
- `/signup` Sign up
- `/login` Login
- `/dashboard` Dashboard
- `/course` Course Map
- `/lesson` Lesson Page
- `/practice` Practice Page
- `/review` Review Page
- `/leaderboard` Leaderboard
- `/profile` Profile
- `/settings` Settings
- `/pricing` Pricing
- `/admin` Admin Content Panel
