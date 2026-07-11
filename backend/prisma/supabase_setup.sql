-- Supabase Setup Script for Comptron Competitive Programming Management System

-- 1. Enable RLS on public tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.days ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.day_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_progress ENABLE ROW LEVEL SECURITY;

-- 2. Foreign Key Constraint linking profiles to auth.users (if not already set)
-- Note: Supabase UI/Dashboard usually creates this when referencing auth.users.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_profiles_auth_users'
  ) THEN
    ALTER TABLE public.profiles 
      ADD CONSTRAINT fk_profiles_auth_users 
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Trigger function to auto-create a profile on user sign up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    username, 
    role, 
    category, 
    rating, 
    university, 
    achievements, 
    certificates, 
    created_at, 
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::public."Role", 'STUDENT'::public."Role"),
    'BEGINNER'::public."Category",
    0,
    'North Western University',
    ARRAY[]::text[],
    ARRAY[]::text[],
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RLS Policies

-- ================= PROFILES =================

DROP POLICY IF EXISTS "Allow users to read own profile" ON public.profiles;
CREATE POLICY "Allow users to read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow instructors and admins to read all profiles" ON public.profiles;
CREATE POLICY "Allow instructors and admins to read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'TRAINER')
    )
  );

DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Allow users to update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow admins full control of profiles" ON public.profiles;
CREATE POLICY "Allow admins full control of profiles" ON public.profiles
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- ================= PHASES, WEEKS, DAYS, DAY RESOURCES =================
-- Read access: All authenticated users can read lessons.
-- Write access: Only Instructors (TRAINER) and Admins (ADMIN) can manage.

-- Phases policies
DROP POLICY IF EXISTS "Allow all authed to read phases" ON public.phases;
CREATE POLICY "Allow all authed to read phases" ON public.phases
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write to phases for admin/trainer" ON public.phases;
CREATE POLICY "Allow write to phases for admin/trainer" ON public.phases
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'TRAINER')
    )
  );

-- Weeks policies
DROP POLICY IF EXISTS "Allow all authed to read weeks" ON public.weeks;
CREATE POLICY "Allow all authed to read weeks" ON public.weeks
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write to weeks for admin/trainer" ON public.weeks;
CREATE POLICY "Allow write to weeks for admin/trainer" ON public.weeks
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'TRAINER')
    )
  );

-- Days policies
DROP POLICY IF EXISTS "Allow all authed to read days" ON public.days;
CREATE POLICY "Allow all authed to read days" ON public.days
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write to days for admin/trainer" ON public.days;
CREATE POLICY "Allow write to days for admin/trainer" ON public.days
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'TRAINER')
    )
  );

-- Day Resources policies
DROP POLICY IF EXISTS "Allow all authed to read day_resources" ON public.day_resources;
CREATE POLICY "Allow all authed to read day_resources" ON public.day_resources
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write to day_resources for admin/trainer" ON public.day_resources;
CREATE POLICY "Allow write to day_resources for admin/trainer" ON public.day_resources
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'TRAINER')
    )
  );

-- ================= STUDENT PROGRESS =================
-- Read: Students read own progress, trainers/admins read all.
-- Write: Students insert/update own progress, trainers/admins manage all.

DROP POLICY IF EXISTS "Allow students to view own progress" ON public.student_progress;
CREATE POLICY "Allow students to view own progress" ON public.student_progress
  FOR SELECT TO authenticated USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'TRAINER')
    )
  );

DROP POLICY IF EXISTS "Allow students to log own progress" ON public.student_progress;
CREATE POLICY "Allow students to log own progress" ON public.student_progress
  FOR ALL TO authenticated USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'TRAINER')
    )
  );
