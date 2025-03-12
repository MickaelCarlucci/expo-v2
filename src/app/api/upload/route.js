import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Désactive le bodyParser (non utilisé en App Router)
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData(); // ✅ Lire le form-data
    const file = formData.get("image"); // Récupérer le fichier "image"

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier reçu" },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Définir le chemin du dossier d'upload
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Définir le nom du fichier
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // Écrire le fichier
    await fs.writeFile(filePath, buffer);

    // URL accessible
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json(
      { message: "Upload réussi", imageUrl: fileUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
