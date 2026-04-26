-- PIZZERIA RP V2 PRO - INSTALLATION
-- À coller UNE SEULE FOIS dans Supabase > SQL Editor > New Query > RUN

create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  discord_name text unique not null,
  role text not null check (role in ('patron', 'employe')),
  created_at timestamp with time zone default now()
);

alter table staff enable row level security;

drop policy if exists "allow all staff" on staff;
create policy "allow all staff" on staff for all using (true) with check (true);

alter table products enable row level security;
alter table ingredients enable row level security;
alter table recipes enable row level security;
alter table sales enable row level security;

drop policy if exists "allow all products" on products;
drop policy if exists "allow all ingredients" on ingredients;
drop policy if exists "allow all recipes" on recipes;
drop policy if exists "allow all sales" on sales;

create policy "allow all products" on products for all using (true) with check (true);
create policy "allow all ingredients" on ingredients for all using (true) with check (true);
create policy "allow all recipes" on recipes for all using (true) with check (true);
create policy "allow all sales" on sales for all using (true) with check (true);

-- Remplace patronne par ton pseudo Discord patron en minuscules.
insert into staff (discord_name, role)
values ('patronne', 'patron')
on conflict (discord_name) do update set role = 'patron';
