-- ============================================================
-- RecipeHub – Initial Schema
-- Run this entire file in the Supabase SQL Editor.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 0. Extensions
-- ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES
--    Extends the built-in auth.users table.
-- ─────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique not null,
  full_name   text,
  avatar_url  text,
  bio         text,
  email       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Automatically create a profile row when a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, email)
  values (
    new.id,
    -- Prefer username from metadata, fall back to the part before @ in email.
    coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''), split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'email', new.email, '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────────────────────────
-- 2. RECIPES
-- ─────────────────────────────────────────────────────────────
create table recipes (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  title        text not null,
  description  text,
  ingredients  text[] not null,
  instructions text[] not null,
  cooking_time    integer, 
  difficulty   text not null default 'easy'
                 check (difficulty in ('easy', 'medium', 'hard')),
  category     text not null,
  image_url    text,
  tags         text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Keep updated_at in sync automatically.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger recipes_updated_at
  before update on public.recipes
  for each row execute procedure public.set_updated_at();


-- ─────────────────────────────────────────────────────────────
-- 3. COMMENTS
-- ─────────────────────────────────────────────────────────────
create table public.comments (
  id         uuid primary key default uuid_generate_v4(),
  recipe_id  uuid not null references public.recipes (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────────
-- 4. RATINGS
-- ─────────────────────────────────────────────────────────────
create table public.ratings (
  id         uuid primary key default uuid_generate_v4(),
  recipe_id  uuid not null references public.recipes (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  rating     integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (recipe_id, user_id)
);


-- ─────────────────────────────────────────────────────────────
-- 5. FAVORITES
-- ─────────────────────────────────────────────────────────────
create table public.favorites (
  id         uuid primary key default uuid_generate_v4(),
  recipe_id  uuid not null references public.recipes (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (recipe_id, user_id)
);


-- ─────────────────────────────────────────────────────────────
-- 6. INDEXES
-- ─────────────────────────────────────────────────────────────
-- Speed up the most common query patterns.
create index on public.recipes (user_id);
create index on public.recipes (category);
create index on public.recipes (created_at desc);
create index on public.recipes using gin (tags);
create index on public.recipes using gin (ingredients);
create index on public.comments (recipe_id);
create index on public.ratings (recipe_id);
create index on public.favorites (user_id);


-- ─────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
alter table public.profiles  enable row level security;
alter table recipes   enable row level security;
alter table public.comments  enable row level security;
alter table public.ratings   enable row level security;
alter table public.favorites enable row level security;

-- ── profiles ────────────────────────────────────────────────
-- Anyone can read profiles (public).
create policy "profiles: public read"
  on public.profiles for select
  using (true);

-- A user can only update their own profile.
create policy "profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id);

-- ── recipes ─────────────────────────────────────────────────
-- Everyone (incl. guests) can read non-deleted recipes.
create policy "recipes: public read"
  on recipes for select
  using (deleted_at is null);

-- Authenticated users can insert their own recipes.
create policy "recipes: authenticated insert"
  on recipes for insert
  with check (auth.uid() = user_id);

-- Users can update only their own recipes.
create policy "recipes: owner update"
  on recipes for update
  using (auth.uid() = user_id);

-- Users can delete (soft-delete) only their own recipes.
create policy "recipes: owner delete"
  on recipes for delete
  using (auth.uid() = user_id);

-- ── comments ────────────────────────────────────────────────
create policy "comments: public read"
  on public.comments for select
  using (true);

create policy "comments: authenticated insert"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "comments: owner delete"
  on public.comments for delete
  using (auth.uid() = user_id);

-- ── ratings ─────────────────────────────────────────────────
create policy "ratings: public read"
  on public.ratings for select
  using (true);

create policy "ratings: authenticated insert"
  on public.ratings for insert
  with check (auth.uid() = user_id);

-- Allow updating your own rating (upsert scenario).
create policy "ratings: owner update"
  on public.ratings for update
  using (auth.uid() = user_id);

create policy "ratings: owner delete"
  on public.ratings for delete
  using (auth.uid() = user_id);

-- ── favorites ───────────────────────────────────────────────
create policy "favorites: owner read"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites: authenticated insert"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites: owner delete"
  on public.favorites for delete
  using (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────
-- 8. STORAGE BUCKETS
-- ─────────────────────────────────────────────────────────────
-- Create buckets for recipe images and user avatars.
insert into storage.buckets (id, name, public)
values
  ('recipe-images', 'recipe-images', true),
  ('avatars',       'avatars',       true)
on conflict (id) do nothing;

-- ── recipe-images policies ──────────────────────────────────
create policy "recipe-images: public read"
  on storage.objects for select
  using (bucket_id = 'recipe-images');

create policy "recipe-images: authenticated upload"
  on storage.objects for insert
  with check (
    bucket_id = 'recipe-images'
    and auth.role() = 'authenticated'
  );

create policy "recipe-images: owner update"
  on storage.objects for update
  using (
    bucket_id = 'recipe-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "recipe-images: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'recipe-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── avatars policies ─────────────────────────────────────────
create policy "avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars: authenticated upload"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
  );

create policy "avatars: owner update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
