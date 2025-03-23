import { NextResponse } from "next/server";
import { serialize, parse } from "cookie";
import * as userDatamapper from "../../utils/datamappers/datamapper.user.js";

export async function POST(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const sessionToken = cookies.session_token;

  if (sessionToken) {
    // 🔎 Retrouve l'utilisateur par le token
    const user = await userDatamapper.getUserByToken(sessionToken);

    if (user) {
      // 🧼 Vide le token en base
      await userDatamapper.clearSessionToken(user.id);
    }
  }
  // 🔹 Supprime le cookie
  const cookie = serialize("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  return NextResponse.json(
    { message: "Déconnexion réussie" },
    { status: 200, headers: { "Set-Cookie": cookie } }
  );
}
