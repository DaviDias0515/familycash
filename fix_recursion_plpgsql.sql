-- Fix Infinite Recursion by preventing function inlining
-- SQL functions can be inlined, causing them to execute in the caller's context (ignoring Security Definer)
-- PL/pgSQL functions are NOT inlined, ensuring Security Definer bypasses RLS effectively.

CREATE OR REPLACE FUNCTION get_user_family_id()
RETURNS UUID AS $$
DECLARE
    v_family_id UUID;
BEGIN
    SELECT family_id INTO v_family_id FROM profiles WHERE id = auth.uid();
    RETURN v_family_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply policies just to be consistent (optional but good for cleanup)
-- Ensure Profiles is clean
DROP POLICY IF EXISTS "Profiles viewable by family" ON profiles;
CREATE POLICY "Profiles viewable by family" ON profiles FOR SELECT USING (
    id = auth.uid() 
    OR 
    family_id = get_user_family_id()
);

-- Ensure Insert/Update/Delete are handled as correct
-- (Already handled by previous fix, but let's be safe for SELECT)

-- Also fix v_family_projection or other views if they relied on RLS context heavily? 
-- No, Views run with permissions of the user, but they use the underlying tables' RLS.
-- This fix on get_user_family_id should resolve the profiles recursion.
