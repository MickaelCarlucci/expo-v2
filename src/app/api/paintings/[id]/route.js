import * as paintingDatamapper from "../../../utils/datamappers/datamapper.paintings.js";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json({ error: "ID requis" }, { status: 400 });
    }

    const painting = await paintingDatamapper.findOne(id);

    if (!painting) {
      return Response.json({ error: "Peinture non trouvée" }, { status: 404 });
    }

    return Response.json(painting, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
