import client from "../database.js";

export async function getUserByPseudo(pseudo) {
  const query = {
    text: `SELECT * FROM "user_admin" WHERE pseudo = $1;`,
    values: [pseudo],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function verifyPassword(pseudo, password) {
  const query = {
    text: `SELECT (password = crypt($2, password)) AS valid FROM user_admin WHERE pseudo = $1`,
    values: [pseudo, password],
  };

  const result = await client.query(query);
  return result.rows.length > 0 && result.rows[0].valid;
}

export async function updatePassword(newPassword, id) {
  const query = {
    text: `UPDATE "user_admin" SET "password"= crypt($1, gen_salt('bf')) WHERE "id"=$2 `,
    values: [newPassword, id],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function saveSessionToken(userId, sessionToken) {
  const query = {
    text: `UPDATE user_admin SET session_token = $1 WHERE id = $2 RETURNING *`,
    values: [sessionToken, userId],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function clearSessionToken(userId) {
  await client.query(
    `UPDATE user_admin SET session_token = NULL WHERE id = $1`,
    [userId]
  );
}

export async function getUserByToken(sessionToken) {
  const query = {
    text: `SELECT * from "user_admin" WHERE session_token = $1;`,
    values: [sessionToken],
  };
  const result = await client.query(query);
  return result.rows[0];
}
