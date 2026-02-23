-- Supabase SQL: products 테이블
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text,
  desc text,
  category text,
  owner_id uuid,
  owner_email text,
  file_path text,
  file_url text,
  hash text,
  views int default 0,
  created_at timestamptz default now()
);

-- messages 테이블: 구매 문의/연락 메시지 저장
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  contact text,
  message text,
  sender_id uuid,
  status text default 'new',
  created_at timestamptz default now()
);
