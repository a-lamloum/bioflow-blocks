-- ============================================================
-- BioFlow Blocks — Initial Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Profiles (extends auth.users) ─────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  display_name text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Projects (saved pipelines) ────────────────────────────────────────────────
create table if not exists public.projects (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  name        text not null,
  mission_id  text not null default 'mission_first_qc_pipeline',
  nodes       jsonb not null default '[]',
  edges       jsonb not null default '[]',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.projects enable row level security;

create policy "Users can manage own projects"
  on public.projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists projects_user_id_idx on public.projects (user_id);

-- ── Mission progress ──────────────────────────────────────────────────────────
create table if not exists public.mission_progress (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users on delete cascade not null,
  mission_id   text not null,
  completed_at timestamptz default now(),
  unique (user_id, mission_id)
);
alter table public.mission_progress enable row level security;

create policy "Users can view own mission progress"
  on public.mission_progress for select
  using (auth.uid() = user_id);

create policy "Users can record own mission completion"
  on public.mission_progress for insert
  with check (auth.uid() = user_id);

create index if not exists mission_progress_user_id_idx on public.mission_progress (user_id);
