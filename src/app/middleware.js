import { NextResponse } from "next/server";

export function middleware(req) {
  const cookies = req.headers.get("cookie") || "";
  const tokenCookie = cookies
    .split("; ")
    .find((row) => row.startsWith("session_token="));

  // 🔹 Si aucun cookie de session trouvé, redirige vers la page de connexion
  if (!tokenCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // ✅ Continue la requête normalement
}

// 🔹 Applique le middleware uniquement aux pages sous `/admin/*`
export const config = {
  matcher: ["/admin/:path*"], // 🔒 Bloque l'accès aux pages `/admin/...`
};
