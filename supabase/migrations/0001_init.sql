-- Cio Driver — փուլ 1. Վարորդ, մեքենա, փաստաթղթեր, գործարքներ
-- Supabase → SQL Editor → New query → տեղադրիր ամբողջը → Run

-- ── Վարորդի պրոֆիլ ─────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  whatsapp text,
  license_no text,
  license_expiry date,
  passport_expiry date,
  lang text not null default 'hy' check (lang in ('hy', 'ru', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Գրանցվելիս ավտոմատ ստեղծվում է դատարկ պրոֆիլ
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, phone) values (new.id, new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Մեքենա ─────────────────────────────────────────────────
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plate text not null,
  brand text,
  model text,
  year int check (year between 1960 and 2100),
  trailer_plate text,
  insurance_expiry date,
  inspection_expiry date,
  tir_carnet_no text,
  tir_carnet_expiry date,
  created_at timestamptz not null default now()
);
create index if not exists vehicles_owner_idx on public.vehicles (owner);

-- ── Փաստաթղթեր (ֆայլերը պահվում են documents bucket-ում) ──
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  vehicle_id uuid references public.vehicles (id) on delete cascade,
  kind text not null check (kind in (
    'passport', 'license', 'tech_front', 'tech_back', 'tir', 'cmr', 'insurance', 'other'
  )),
  path text not null,
  created_at timestamptz not null default now()
);
create index if not exists documents_owner_idx on public.documents (owner);

-- ── Գործարքներ ─────────────────────────────────────────────
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  vehicle_id uuid references public.vehicles (id) on delete set null,
  code text,
  from_city text not null,
  to_city text not null,
  cargo text,
  client text,
  logistician_phone text,
  fare numeric(12, 2),
  currency text default 'USD',
  start_date date,
  status text not null default 'active' check (status in ('active', 'done')),
  done_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists deals_owner_idx on public.deals (owner, status);

-- ── Անվտանգություն. ամեն վարորդ տեսնում է միայն իր տվյալները ──
alter table public.profiles  enable row level security;
alter table public.vehicles  enable row level security;
alter table public.documents enable row level security;
alter table public.deals     enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "own vehicles" on public.vehicles;
create policy "own vehicles" on public.vehicles
  for all using (owner = auth.uid()) with check (owner = auth.uid());

drop policy if exists "own documents" on public.documents;
create policy "own documents" on public.documents
  for all using (owner = auth.uid()) with check (owner = auth.uid());

drop policy if exists "own deals" on public.deals;
create policy "own deals" on public.deals
  for all using (owner = auth.uid()) with check (owner = auth.uid());

-- ── Ֆայլերի պահոց (փակ). ճանապարհը՝ <user_id>/<ֆայլ> ────────
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

drop policy if exists "own files read" on storage.objects;
create policy "own files read" on storage.objects
  for select using (
    bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "own files write" on storage.objects;
create policy "own files write" on storage.objects
  for insert with check (
    bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "own files delete" on storage.objects;
create policy "own files delete" on storage.objects
  for delete using (
    bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text
  );
