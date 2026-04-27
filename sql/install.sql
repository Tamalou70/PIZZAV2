create table if not exists products(
id uuid primary key default gen_random_uuid(),
name text,
price numeric,
image_url text
);

create table if not exists ingredients(
id uuid primary key default gen_random_uuid(),
name text,
stock numeric default 0
);

create table if not exists recipes(
id uuid primary key default gen_random_uuid(),
product_id uuid,
ingredient_name text,
quantity numeric
);
