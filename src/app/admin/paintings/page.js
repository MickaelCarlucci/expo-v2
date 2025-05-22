"use client";
import { useState } from "react";
import Image from "next/image";

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
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
      alert("Veuillez choisir une photo !");
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
    console.log("Upload response:", uploadData);
    if (!uploadRes.ok) {
      alert(uploadData.error);
      return;
    }

    const imageUrl = uploadData.imageUrl;

    // 2️⃣ Ajouter le tableau dans PostgreSQL
    const paintingRes = await fetch("/api/paintings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        paintingUrl: imageUrl,
        description,
        price: parseFloat(price),
        userAdmin: 1,
      }),
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
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Prix"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required
      />
      {preview && (
        <Image
          src={preview}
          alt="Aperçu"
          width={100}
          height={100}
          style={{ objectFit: "cover" }}
        />
      )}

      <button type="submit">Ajouter le tableau</button>
    </form>
  );
}
