import * as paintingDatamapper from "../../utils/datamappers/datamapper.paintings.js";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const painting = await paintingDatamapper.findOne(id);

      if (!painting) {
        return res.status(404).json({ error: "Peinture non trouvée" });
      }

      return res.status(200).json(painting);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Impossible de charger la peinture" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}
