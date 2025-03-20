-- Deploy expo_v2:insert_admin to pg

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
INSERT INTO user_admin (pseudo, password) 
VALUES ('Patriciadmin', crypt('PatochelaRigolote2025', gen_salt('bf')));

COMMIT;
