-- FADFAAD Database Functions Export
-- Generated on: Sat, 06 Jun 2026

-- 1. Helper: update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Helper: is_admin check by authenticated user's email against public.admins
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE a.email = (auth.jwt() ->> 'email')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 3. create_order_rpc (Stored Procedure for Atomic Order Creation)
-- This function is assumed based on the application code usage.
-- In a real scenario, this would be exported directly from Supabase.

CREATE OR REPLACE FUNCTION public.create_order_rpc(
    p_customer_name TEXT,
    p_phone_number TEXT,
    p_governorate TEXT,
    p_address TEXT,
    p_notes TEXT,
    p_total_amount NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_order_no TEXT;
BEGIN
    INSERT INTO public.orders (
        customer_name,
        phone_number,
        governorate,
        address,
        notes,
        total_amount,
        status
    ) VALUES (
        p_customer_name,
        p_phone_number,
        p_governorate,
        p_address,
        p_notes,
        p_total_amount,
        'NEW'
    )
    RETURNING id, order_no INTO v_order_id, v_order_no;

    RETURN jsonb_build_object(
        'id', v_order_id,
        'order_no', v_order_no
    );
END;
$$;
