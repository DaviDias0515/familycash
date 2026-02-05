-- 1. Allow profiles to exist without a family initially (Profile First flow)
ALTER TABLE profiles ALTER COLUMN family_id DROP NOT NULL;

-- 2. Update Families SELECT policy to allow Admins to view their family
-- (even if they are not yet 'linked' via profile.family_id in the view context)
DROP POLICY IF EXISTS "Families viewable by members" ON families;

CREATE POLICY "Families viewable by members" 
ON families 
FOR SELECT 
USING (
    id = get_user_family_id() 
    OR 
    admin_id = auth.uid() -- Critical for returning data after insert
);

-- 3. Ensure INSERT policies exist (in case previous script failed or to be sure)
DROP POLICY IF EXISTS "Families insertable by authenticated" ON families;
CREATE POLICY "Families insertable by authenticated" ON families FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Profiles insertable by self" ON profiles;
CREATE POLICY "Profiles insertable by self" ON profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- 4. Ensure Families Update policy covers the transition
DROP POLICY IF EXISTS "Families editable by admin" ON families;
CREATE POLICY "Families editable by admin" 
ON families 
FOR UPDATE 
USING (
    (id = get_user_family_id() AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    OR
    admin_id = auth.uid() -- Allow admin to update their own family (e.g. initial setup)
);
