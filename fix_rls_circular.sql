-- 1. Allow nullable admin_id to break circular dependency during creation
ALTER TABLE families ALTER COLUMN admin_id DROP NOT NULL;

-- 2. Add INSERT policy for families
-- Allow any authenticated user to create a family
CREATE POLICY "Families insertable by authenticated" 
ON families 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 3. Add INSERT policy for profiles
-- Allow users to create their own profile
CREATE POLICY "Profiles insertable by self" 
ON profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());

-- 4. Fix RLS for Update on Families to allow the creator to set the admin_id initially
-- The existing update policy requires being an admin in profiles.
-- But during the 3-step process (Create Family -> Create Profile -> Update Family),
-- the user IS an admin in profiles by step 2. So the existing policy might work?
-- Existing: "Families editable by admin" USING (id = get_user_family_id() AND ... role='admin')
-- get_user_family_id() uses the profile.
-- So yes, after step 2 (profile created with role='admin' and family_id), the user CAN update the family.

-- However, let's verify if `get_user_family_id` works correctly immediately.
-- It selects from profiles.
