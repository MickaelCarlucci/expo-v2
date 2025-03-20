"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./page.css";

export default function Page() {
  const [paintings, setPaintings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPaintings() {
      try {
        const response = await fetch("api/paintings");
        const data = await response.json();
        setPaintings(data);
        setError(null);
      } catch (error) {
        setError("erreur lors de la récupération des tableaux");
        console.error("erreur lors de la récupération des tableaux:", error);
      }
    }
  });

  return <div></div>;
}
