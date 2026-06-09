-- RLS Security Configuration Script for Supabase PostgreSQL
-- Targets tables: teachers, students, artifacts
-- Implements robust, enterprise-grade Row Level Security (RLS)
-- Validates school partition isolation via standard Supabase JWT claims: auth.jwt() -> 'user_metadata' ->> 'school_id'

-- ==========================================
-- 1. TEACHERS TABLE SECURITY
-- ==========================================

-- Enable Row Level Security (RLS) on 'teachers'
ALTER TABLE "teachers" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent key conflicts
DROP POLICY IF EXISTS select_teacher_by_school ON "teachers";
DROP POLICY IF EXISTS insert_teacher_by_school ON "teachers";

-- SELECT policy: Users can only see teachers belonging to their school
CREATE POLICY select_teacher_by_school ON "teachers"
    FOR SELECT
    TO authenticated
    USING (
        "schoolId" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
        OR "school_id" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
    );

-- INSERT policy: Users can only create teachers belonging to their school
CREATE POLICY insert_teacher_by_school ON "teachers"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        "schoolId" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
        OR "school_id" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
    );


-- ==========================================
-- 2. STUDENTS TABLE SECURITY
-- ==========================================

-- Enable Row Level Security (RLS) on 'students'
ALTER TABLE "students" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent key conflicts
DROP POLICY IF EXISTS select_student_by_school ON "students";
DROP POLICY IF EXISTS insert_student_by_school ON "students";

-- SELECT policy: Users can only see students in their school group
CREATE POLICY select_student_by_school ON "students"
    FOR SELECT
    TO authenticated
    USING (
        "schoolId" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
        OR "school_id" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
    );

-- INSERT policy: Users can only create students in their school group
CREATE POLICY insert_student_by_school ON "students"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        "schoolId" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
        OR "school_id" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
    );


-- ==========================================
-- 3. ARTIFACTS TABLE SECURITY (Sub-Query Join)
-- ==========================================
-- Note: Artifact table does not have a schoolId directly, so we check
-- relation to the 'students' or 'teachers' tables to verify the parent school_id maps.

-- Enable Row Level Security (RLS) on 'artifacts'
ALTER TABLE "artifacts" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent key conflicts
DROP POLICY IF EXISTS select_artifact_by_school ON "artifacts";
DROP POLICY IF EXISTS insert_artifact_by_school ON "artifacts";

-- SELECT policy: Users can only see artifacts belonging to students of their school
CREATE POLICY select_artifact_by_school ON "artifacts"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "students" s
            WHERE s.id = "artifacts"."studentId" 
            AND (
                s."schoolId" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
                OR s."school_id" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
            )
        )
    );

-- INSERT policy: Users can only insert artifacts belonging to students of their school
CREATE POLICY insert_artifact_by_school ON "artifacts"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "students" s
            WHERE s.id = "artifacts"."studentId" 
            AND (
                s."schoolId" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
                OR s."school_id" = (auth.jwt() -> 'user_metadata' ->> 'school_id')
            )
        )
    );
