"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavAdminBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("api/login")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);
  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <Link href="/">Accueil</Link>
          <Link href="/admin">messages</Link>
          <Link href="/admin/paintings">Ajouter une oeuvre d&apos;Art</Link>
        </div>
        <div className="nav-right">
          {user ? (
            <span>Connecté en tant que {user.pseudo}</span>
          ) : (
            <a href="/login">Connexion</a>
          )}
        </div>
      </nav>
    </div>
  );
}
