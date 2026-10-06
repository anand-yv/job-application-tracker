-- Hibernate ddl-auto=update does not widen existing columns.
-- Run once against an existing database.

ALTER TABLE job_applications
    ALTER COLUMN notes TYPE text,
    ALTER COLUMN job_url TYPE varchar(2048);

ALTER TABLE contacts
    ALTER COLUMN notes TYPE text;
