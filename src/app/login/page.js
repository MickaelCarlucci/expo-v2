"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, password }),
    });

    if (res.ok) {
      router.push("/admin"); // Redirige vers une page protégée
    } else {
      const data = await res.json();
      setError(data.error || "Erreur inconnue");
    }
  }

  return (
    <div className="div-form-login">
      <form className="form-login" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit">Connexion</button>
      </form>
    </div>
  );
}
