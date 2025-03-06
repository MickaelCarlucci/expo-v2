import client from "../database.js";

export async function findAll() {
  const query = {
    text: `SELECT * FROM "paintings";`,
  };
  const result = await client.query(query);
  return result.rows;
}

export async function findOne(id) {
  const query = {
    text: `SELECT * FROM "paintings" WHERE id = $1;`,
    values: [id],
  };
  const result = await client.query(query);
  return result.rows;
}

export async function createPainting(title, paintingUrl, description, price) {
  const query = {
    text: `INSERT INTO "paintings" (title, painting_url, description, price) VALUES ($1, $2, $3, $4) RETURNING *;`,
    values: [title, paintingUrl, description, price],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function updatePainting(fields, index, values) {
  const query = {
    text: `UPDATE "paintings" SET ${fields.join(
      ", "
    )} WHERE id = $${index} RETURNING *;`,
    values,
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function deletePainting(id) {
  const query = {
    text: `DELETE FROM "paintings" WHERE id = $1;`,
    values: [id],
  };
  const result = await client.query(query);
  return result.rows[0];
}
