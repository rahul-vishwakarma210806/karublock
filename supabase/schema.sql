-- Run this once in Supabase: SQL Editor > New query > Run
create table if not exists quizzes (
  code text primary key,
  creator text not null,
  lang text not null default 'en',
  questions jsonb not null,
  created_at timestamptz not null default now()
);
create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  code text not null references quizzes(code) on delete cascade,
  name text not null,
  score int not null,
  total int not null,
  created_at timestamptz not null default now()
);
create index if not exists attempts_code_idx on attempts(code);
-- The app uses the service key on the server only. Keep RLS ON and add no public policies.
alter table quizzes enable row level security;
alter table attempts enable row level security;
