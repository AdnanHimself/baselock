-- Function to atomically increment sales_count and update last_purchased_at
create or replace function increment_sales_count(row_id text)
returns void
language plpgsql
as $$
begin
  update links
  set 
    sales_count = sales_count + 1,
    last_purchased_at = now()
  where id = row_id;
end;
$$;
