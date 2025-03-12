import * as messageDatamapper from "../../../utils/datamappers/datamapper.messages.js";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return Response.json({ error: "ID requis" }, { status: 400 });
    }
    const message = await messageDatamapper.findOne(id);
    if (!message) {
      return Response.json({ error: "message non trouvée" }, { status: 404 });
    }
    return Response.json(message, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
