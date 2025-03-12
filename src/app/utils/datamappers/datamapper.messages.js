import client from "../database.js";

export async function findAll() {
  const query = {
    text: `SELECT * FROM "messages";`,
  };
  const result = client.query(query);
  return result.rows;
}

export async function findOne(id) {
  const query = {
    text: `SELECT * FROM "messages" WHERE id = $1;`,
    values: [id],
  };
  const result = client.query(query);
  return result.rows[0];
}

export async function createMessage(email, message, phone, userAdmin) {
  const query = {
    text: `INSERT INTO "messages" (email, message, phone, user_admin_id) VALUES ($1, $2, $3, $4) RETURNING *;`,
    values: [email, message, phone, userAdmin],
  };
  const result = client.query(query);
  return result.rows[0];
}

export async function deleteMessage(id) {
  const query = {
    text: `DELETE FROM "messages" WHERE id = $1;`,
    values: [id],
  };
  const result = client.query(query);
  return result.rows[0];
}
