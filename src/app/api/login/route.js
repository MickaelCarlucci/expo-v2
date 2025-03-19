import { NextResponse } from "next/server";
import { serialize } from "cookie";
import * as userDatamapper from "../../utils/datamappers/datamapper.user.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const { pseudo, password } = body;

    if (!pseudo || !password) {
      return NextResponse.json(
        { error: "Pseudo et mot de passe requis" },
        { status: 400 }
      );
    }

    // 🔹 Vérifie si l'utilisateur existe
    const user = await userDatamapper.getUserByPseudo(pseudo);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 401 }
      );
    }

    // 🔹 Vérifie si le mot de passe est correct
    const isValid = await userDatamapper.verifyPassword(pseudo, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // 🔹 Création d'un token simple pour la session
    const sessionToken = Math.random().toString(36).substring(2);

    // 🔹 Stocke le token dans un cookie sécurisé
    const cookie = serialize("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // Expiration : 1 jour
      path: "/",
    });

    return NextResponse.json(
      { message: "Connexion réussie" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req) {
  const cookies = req.headers.get("cookie") || "";
  const sessionToken = cookies
    .split("; ")
    .find((row) => row.startsWith("session_token="));

  if (!sessionToken) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  return NextResponse.json({ loggedIn: true }, { status: 200 });
}
