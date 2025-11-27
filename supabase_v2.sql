-- Create a table for public profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Drop existing policies to avoid errors
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;

-- Policy: Public can read profiles (needed for checking roles?) 
-- Actually, only the user themselves or admins should read roles.
create policy "Users can read own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Admins can read all profiles"
  on public.profiles for select
  using ( 
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create a table for feedback
create table if not exists public.feedback (
  id uuid not null default uuid_generate_v4(),
  user_id uuid references auth.users, -- Optional, if logged in
  message text not null,
  category text, -- 'bug', 'feature', 'other'
  status text default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS
alter table public.feedback enable row level security;

-- Drop existing policies to avoid errors
drop policy if exists "Anyone can insert feedback" on public.feedback;
drop policy if exists "Admins can read feedback" on public.feedback;
drop policy if exists "Admins can update feedback" on public.feedback;

-- Policy: Anyone can insert feedback (anon or auth)
create policy "Anyone can insert feedback"
  on public.feedback for insert
  with check (true);

-- Policy: Only admins can read feedback
create policy "Admins can read feedback"
  on public.feedback for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Only admins can update feedback (e.g. mark as read)
create policy "Admins can update feedback"
  on public.feedback for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Function to handle new user signup (automatically create profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing; -- Handle existing profiles
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
-- Drop trigger if exists first
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED: Make the first user an admin (You might need to run this manually or adjust the ID)
-- update public.profiles set role = 'admin' where id = 'YOUR_USER_ID';
