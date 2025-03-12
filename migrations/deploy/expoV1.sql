-- Deploy expo_v2:expoV1 to pg

BEGIN;
SET client_encoding = 'UTF8';

CREATE table "user_admin" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "pseudo" VARCHAR(30) NOT NULL UNIQUE,
    "password" VARCHAR(150) NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE table "paintings" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" VARCHAR(30) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "painting_url" VARCHAR(200) NOT NULL,
    "user_admin_id" INT NOT NULL REFERENCES "user_admin"("id") ON DELETE CASCADE
);

CREATE table "messages" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" VARCHAR(100) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    "message" TEXT NOT NULL,
    "phone" VARCHAR(100) CHECK (phone ~ '^[0-9]+$'),
    "user_admin_id" INT NOT NULL DEFAULT 1 REFERENCES "user_admin"("id") ON DELETE CASCADE
);

COMMIT;
