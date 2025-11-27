-- Add columns for dashboard stats and link management

-- 1. Add sales_count to track number of purchases
alter table public.links 
add column if not exists sales_count integer default 0;

-- 2. Add is_active for soft delete (hiding links)
alter table public.links 
add column if not exists is_active boolean default true;

-- 3. Add last_purchased_at for recent activity tracking
alter table public.links 
add column if not exists last_purchased_at timestamp with time zone;

-- 4. Update RLS policies to allow updating these columns via Service Role (API)
-- (Service Role bypasses RLS, so no specific policy needed for API)

-- 5. Ensure users can only see their own active links (or all if they are owner)
-- Existing policy "Public links are viewable by everyone" allows SELECT.
-- We might want to restrict "deleted" links from public view?
-- Let's update the public read policy to only show active links.

drop policy if exists "Public links are viewable by everyone" on public.links;

create policy "Public links are viewable by everyone"
  on public.links for select
  using ( is_active = true );

-- However, the creator should be able to see their own deleted links?
-- For now, let's keep it simple: Public can only see active links.
-- If we want "My Links" to show deleted ones, we'd need a separate policy or just filter in frontend if RLS allows.
-- But "Public links are viewable by everyone" means EVERYONE.
-- So if we filter `is_active = true`, then even the owner can't see deleted links via this policy.
-- But the owner is just a wallet address string in `receiver_address`, not an authenticated Supabase user (we use anon key).
-- So we rely on the frontend to filter.
-- WAIT: If I change the policy to `is_active = true`, then `fetchLinks` in MyLinks page (which uses anon key) won't return deleted links.
-- This effectively "deletes" them from the UI, which is what we want for "Delete".
