create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now()
);

create table if not exists booths (
  id uuid primary key default gen_random_uuid(),
  stamp_url text not null,
  title text not null,
  room text not null,
  stallholder text not null
);

create table if not exists scan_logs (
  id serial primary key,
  user_id uuid not null references users(id) on delete cascade,
  booth_id uuid not null references booths(id) on delete cascade,
  scanned_at timestamp with time zone not null default now()
);