-- Final Fix for Recursion
-- The issue is attempting to look up "family members" while checking permissions for "profiles".
-- While the Security Definer function should work, it's safer to simplify the policy for Onboarding.

-- 1. Drop the recursive policy on Profiles
DROP POLICY IF EXISTS "Profiles viewable by family" ON profiles;

-- 2. Create a simple "View Self" policy (No recursion possible)
-- This allows the user to see/update/insert their OWN profile, which is all that is needed for Onboarding.
CREATE POLICY "Profiles viewable by self" 
ON profiles 
FOR SELECT 
USING (id = auth.uid());

-- 3. Ensure "Profiles insertable by self" exists (for the upsert)
DROP POLICY IF EXISTS "Profiles insertable by self" ON profiles;
CREATE POLICY "Profiles insertable by self" 
ON profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());

-- 4. Ensure "Profiles updateable by self" exists (for linking family)
DROP POLICY IF EXISTS "Profiles updateable by self" ON profiles;
CREATE POLICY "Profiles updateable by self" 
ON profiles 
FOR UPDATE 
USING (id = auth.uid());

-- Note: This means you cannot see other family members yet. 
-- We can add a separate policy for viewing family members later that doesn't trigger recursion,
-- or rely on the Admin functions. For the MVP Onboarding, this unblocks the creation flow.
