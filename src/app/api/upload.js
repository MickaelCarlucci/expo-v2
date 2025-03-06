import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Désactive le bodyParser pour gérer les fichiers
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Méthode ${req.method} non autorisée` });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "public/uploads"); // Dossier de stockage
  form.keepExtensions = true; // Conserve l'extension des fichiers

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de l'upload" });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    const newFileName = `${Date.now()}_${file.originalFilename}`; // Renommage pour éviter les conflits
    const newFilePath = path.join(form.uploadDir, newFileName);

    // Déplacer l'image vers le dossier public/uploads
    fs.renameSync(file.filepath, newFilePath);

    // URL accessible depuis Next.js
    const fileUrl = `/uploads/${newFileName}`;

    // Ici, vous devriez enregistrer `fileUrl` dans PostgreSQL
    res.status(200).json({ message: "Upload réussi", imageUrl: fileUrl });
  });
}
