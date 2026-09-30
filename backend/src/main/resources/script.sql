-- ==========================================
-- SHOW TABLES
-- ==========================================

select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;

-- ==========================================
-- SHOW TABLE COLUMNS
-- ==========================================

SELECT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

- ==========================================
-- CHECK USERS
-- ==========================================

SELECT * FROM users;


-- ==========================================
-- CHECK JOB APPLICATIONS
-- ==========================================

SELECT * FROM job_applications;