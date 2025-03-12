import { NextResponse } from "next/server";
import * as messagesDatamapper from "../../utils/datamappers/datamapper.messages.js";

export async function GET() {
  try {
    const messages = await messagesDatamapper.findAll();
    if (!messages) {
      return NextResponse.json({ error: "Aucun messages" }, { status: 404 });
    }
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de charger les messages" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("🔹 Données reçues :", body);

    const { email, message, phone } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: "Les champs email et message sont obligatoires" },
        { status: 400 }
      );
    }

    // 🔹 Vérification du format du téléphone
    if (phone && (!/^\d+$/.test(phone) || phone.length > 20)) {
      return NextResponse.json(
        {
          error:
            "Le téléphone doit contenir uniquement des chiffres et ne pas dépasser 20 caractères",
        },
        { status: 400 }
      );
    }

    // 🔹 Transformation du téléphone en `null` si non fourni
    const phoneValue = phone ? phone.toString() : null;

    const newMessage = await messagesDatamapper.createMessage(
      email,
      message,
      phoneValue
    );

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement du message :", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le message" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }
    await messagesDatamapper.deleteMessage(id);
    return NextResponse.json(
      { message: "Le message a bien été supprimé" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de supprimer le message" },
      { status: 500 }
    );
  }
}
