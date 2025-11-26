-- Create the table for storing links
create table links (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  target_url text not null,
  title text,
  price numeric not null,
  receiver_address text not null,
  token_address text default '0x0000000000000000000000000000000000000000'
);

-- Enable Row Level Security (RLS)
alter table links enable row level security;

-- Policy: Anyone can read links (to see price/title)
create policy "Public links are viewable by everyone"
  on links for select
  to anon
  using ( true );

-- Policy: Anyone can create links (for MVP)
create policy "Anyone can insert links"
  on links for insert
  to anon
  with check ( true );
