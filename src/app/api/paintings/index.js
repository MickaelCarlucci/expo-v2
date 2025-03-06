import * as paintingDatamapper from "../../utils/datamappers/datamapper.paintings.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const paintings = await paintingDatamapper.findAll();
      return res.status(200).send(paintings);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "impossible de charger les peintures" });
    }
  } else if (req.method === "POST") {
    try {
      const { title, paintingUrl, description, price } = req.body;
      if (!title || !paintingUrl || !description || !price) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }
      const painting = await paintingDatamapper.createPainting(
        title,
        paintingUrl,
        description,
        price
      );
      return res.status(200).send(painting);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "impossible d'enregistrer la peinture" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { data } = req.body;
      const fields = [];
      const values = [];
      let index = 1;

      for (const key in data) {
        if (data[key] !== undefined) {
          // Vérifie si une valeur est donnée
          fields.push(`${key} = $${index}`);
          values.push(data[key]);
          index++;
        }
      }

      if (fields.length === 0) {
        throw new Error("Aucune donnée à mettre à jour");
      }

      values.push(id);

      const updatedPainting = await paintingDatamapper.updatePainting(
        fields,
        index,
        values
      );
      return res.status(200).send(updatedPainting);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "impossible de modifier la peinture" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await paintingDatamapper.deletePainting(id);
      return res
        .status(200)
        .json({ message: "La peinture a bien été supprimé" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "impossible de supprimer la peinture" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}
