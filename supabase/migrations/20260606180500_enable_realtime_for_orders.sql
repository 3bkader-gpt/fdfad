-- Enable Realtime for the orders table
begin;
  -- If supabase_realtime publication exists, add the table to it
  do $$
  begin
    if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
      alter publication supabase_realtime add table orders;
    end if;
  end $$;
commit;
