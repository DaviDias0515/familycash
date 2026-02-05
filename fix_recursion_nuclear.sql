-- NUCLEAR FIX FOR PROFILES RECURSION
-- The previous fixes missed "FOR ALL" policies like "Profiles manage by admin" which also recurse.

-- 1. Drop ALL policies on profiles explicitly
DROP POLICY IF EXISTS "Profiles viewable by family" ON profiles;
DROP POLICY IF EXISTS "Profiles manage by admin" ON profiles; -- This was the hidden culprit!
DROP POLICY IF EXISTS "Profiles insertable by self" ON profiles;
DROP POLICY IF EXISTS "Profiles updateable by self" ON profiles;
DROP POLICY IF EXISTS "Profiles viewable by self" ON profiles;

-- 2. Create SIMPLE, NON-RECURSIVE policies for Onboarding
-- Allow users to do ANYTHING to their OWN profile.
CREATE POLICY "Profiles full access by self" 
ON profiles 
FOR ALL 
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 3. Allow Admins to View/Update OTHER profiles (Non-recursive check)
-- Instead of checking "Am I admin?" via a query on Profiles (which recurses),
-- we can trust the 'self' check for now, or use a JWT claim if available.
-- For now, let's just stick to "Self Access" which is 100% safe for Onboarding.
-- We can add complex "Admin manages others" policies LATER once the first user is created.

-- This script leaves 'profiles' with ONLY one policy: "Profiles full access by self".
-- This guarantees no recursion.
