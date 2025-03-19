import { NextResponse } from "next/server";
import * as messagesDatamapper from "../../utils/datamappers/datamapper.messages.js";
import sanitizeHtml from "sanitize-html";

function cleanInput(input) {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

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

    const { email, message, phone, recaptchaToken } = body;

    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Vérification reCAPTCHA échouée." },
        { status: 403 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
    console.log("🔹 IP de l'utilisateur :", ip);

    // 🛡 Vérifier si cette IP a dépassé la limite de 3 messages dans l'heure
    const messageCount = await messagesDatamapper.countMessagesFromIp(ip);
    if (messageCount >= 3) {
      return NextResponse.json(
        {
          error: "Vous avez dépassé la limite de messages. Essayez plus tard.",
        },
        { status: 429 } // 429 = Trop de requêtes
      );
    }

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

    const cleanEmail = cleanInput(email);
    const cleanMessage = cleanInput(message);
    // 🔹 Transformation du téléphone en `null` si non fourni
    const phoneValue = phone ? phone.toString() : null;

    const newMessage = await messagesDatamapper.createMessage(
      cleanEmail,
      cleanMessage,
      phoneValue,
      ip
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
