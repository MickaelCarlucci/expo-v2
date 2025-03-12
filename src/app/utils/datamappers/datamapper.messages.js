import client from "../database.js";

export async function findAll() {
  const query = {
    text: `SELECT * FROM "messages";`,
  };
  const result = await client.query(query);
  return result.rows;
}

export async function findOne(id) {
  const query = {
    text: `SELECT * FROM "messages" WHERE id = $1;`,
    values: [id],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function createMessage(email, message, phone) {
  const query = {
    text: `INSERT INTO "messages" (email, message, phone) VALUES ($1, $2, $3) RETURNING *;`,
    values: [email, message, phone],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function deleteMessage(id) {
  const query = {
    text: `DELETE FROM "messages" WHERE id = $1;`,
    values: [id],
  };
  const result = await client.query(query);
  return result.rows[0];
}
