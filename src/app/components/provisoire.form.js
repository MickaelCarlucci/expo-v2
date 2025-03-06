import { useState } from "react";

export default function PaintingUploader() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Affichage de l'aperçu
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Veuillez choisir une image !");
      return;
    }

    // 1️⃣ Upload de l'image
    const formData = new FormData();
    formData.append("image", image);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      alert(uploadData.error);
      return;
    }

    const imageUrl = uploadData.imageUrl;

    // 2️⃣ Ajouter le tableau dans PostgreSQL
    const paintingRes = await fetch("/api/paintings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, imageUrl, description, price }),
    });

    const paintingData = await paintingRes.json();
    if (paintingRes.ok) {
      alert("Tableau ajouté avec succès !");
    } else {
      alert(paintingData.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Artiste"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Année"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required
      />
      {preview && <image src={preview} alt="Aperçu" width="100" />}

      <button type="submit">Ajouter le tableau</button>
    </form>
  );
}
