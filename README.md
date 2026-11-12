# Karublock – Best Friend Test

Made for school and college students. Pick a category, tap your answer to 10 ready-made questions (options are pre-filled with pictures), share the link, and friends guess your answers. Scores, leaderboard, rank titles and a WhatsApp-ready result card. Hindi + English, mobile-first, animated.

## Run it (works with no setup)
```
npm install
npm run dev        # http://localhost:3000
```
Without Supabase keys the app uses an in-memory store: everything works, but data is lost on restart.

## Save data permanently (Supabase free tier)
1. Create a project at supabase.com → SQL Editor → paste and run `supabase/schema.sql`.
2. Project Settings → API → copy the project URL and the `service_role` key.
3. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.
   The service key is used on the server only. Never put it in a `NEXT_PUBLIC_` variable.
4. Restart. The app switches to Supabase automatically.
Note: free Supabase projects pause after about a week of no activity.

## Deploy
Set `NEXT_PUBLIC_SITE_URL` to your real domain (needed so WhatsApp link previews show the result card), plus the two Supabase variables, on your host.
Vercel's free Hobby plan is for non-commercial use, so check its terms before you show ads. Cloudflare's free tier allows commercial use (use `@opennextjs/cloudflare`; the original Karublock project already had that config).

## Structure
- `src/lib/bank.ts` – the 24 ready-made questions (School, College, Friends & fun) in English and Hindi. Add more here.
- `src/components/Create.tsx` – creator wizard (tap answers, swap question, write own question with photo options)
- `src/components/Play.tsx` – intro → questions → score → leaderboard → review
- `src/app/api/quiz/**` – create, fetch (never sends correct answers), submit (score is computed on the server)
- `src/app/api/og` – result-card image used for WhatsApp previews and the Download button
- `src/lib/data.ts` – data layer (memory or Supabase)
- `src/lib/i18n.tsx` – all English/Hindi text and starter questions

## Known gaps / next steps
- Built-in options use emoji as their pictures. Custom questions let the creator upload a real photo per option (resized to a small JPEG in the browser).
- Safety: only first names are collected, no login. Photos are user-uploaded, so add a report/moderation step before real traffic.
- Result card image has Latin text only; Devanagari names show as boxes until a Hindi font is bundled into `api/og`.
- No rate limiting or spam protection yet. Add this (e.g. Cloudflare Turnstile) before real traffic.
- Before applying to AdSense: add Privacy Policy, About and Contact pages.
- Later: categories (couples, family, crush), creator "edit key", quiz expiry.
