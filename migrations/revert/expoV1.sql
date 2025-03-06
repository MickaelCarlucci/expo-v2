-- Revert expo_v2:expoV1 from pg

BEGIN;

DROP TABLE "user_admin", "paintings", "messages";

COMMIT;
