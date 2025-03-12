import * as messagesDatamapper from "../../utils/datamappers/datamapper.messages.js";

export async function GET() {
  try {
    const messages = await messagesDatamapper.findAll();
    if (!messages) {
      return Response.json({ error: "Aucun messages" }, { status: 404 });
    }
    return Response.json(messages, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Impossible de charger les messages" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, message, phone } = body;
    const userAdmin = 1;

    if (!email || !message) {
      return Response.json(
        { error: "les champs email et message sont obligatoires" },
        { status: 400 }
      );
    }

    const newMessage = await messagesDatamapper.createMessage(
      email,
      message,
      phone,
      userAdmin
    );
    return Response.json(newMessage, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Impossible d'enregistrer le nouveau message" },
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
    await messagesDatamapper.deleteMessage(id);
    return Response.json(
      { message: "Le message a bien été supprimé" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Impossible de supprimer le message" },
      { status: 500 }
    );
  }
}
