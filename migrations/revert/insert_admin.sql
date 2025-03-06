-- Revert expo_v2:insert_admin from pg

BEGIN;

DELETE FROM user_admin WHERE pseudo = 'Patriciadmin';

COMMIT;
