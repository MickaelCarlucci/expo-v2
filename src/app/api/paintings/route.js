import * as paintingDatamapper from "../../utils/datamappers/datamapper.paintings.js";

export async function GET() {
  try {
    const paintings = await paintingDatamapper.findAll();
    if (!paintings) {
      return Response.json(
        { error: "Aucune peinture trouvée" },
        { status: 404 }
      );
    }
    return Response.json(paintings, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Impossible de charger les peintures" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, paintingUrl, description, price, userAdmin } = body;

    if (!title || !paintingUrl || !description || !price) {
      return Response.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const painting = await paintingDatamapper.createPainting(
      title,
      paintingUrl,
      description,
      price,
      userAdmin
    );
    return Response.json(painting, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Impossible d'enregistrer la peinture" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return Response.json({ error: "ID manquant" }, { status: 400 });
    }

    const fields = [];
    const values = [];
    let index = 1;

    for (const key in body) {
      if (body[key] !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(body[key]);
        index++;
      }
    }

    if (fields.length === 0) {
      return Response.json(
        { error: "Aucune donnée à mettre à jour" },
        { status: 400 }
      );
    }

    values.push(id);
    const updatedPainting = await paintingDatamapper.updatePainting(
      fields,
      index,
      values
    );
    console.log("updatedPainting:", updatedPainting);
    return Response.json(updatedPainting, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Impossible de modifier la peinture" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID manquant" }, { status: 400 });
    }

    await paintingDatamapper.deletePainting(id);
    return Response.json(
      { message: "La peinture a bien été supprimée" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Impossible de supprimer la peinture" },
      { status: 500 }
    );
  }
}
