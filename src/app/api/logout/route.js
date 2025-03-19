import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
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
