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
    fetchPaintings();
  }, []);

  const lastPainting =
    paintings.length > 0 ? paintings[paintings.length - 1] : null;

  return (
    <>
      {error && <p className="error">{error}</p>}
      <div className="last-work">
        {lastPainting ? (
          <div>
            <h2>{lastPainting.title}</h2>
            {lastPainting.painting_url ? (
              <Image
                src={lastPainting.painting_url}
                alt={lastPainting.description || "Œuvre"}
                width={300}
                height={300}
                layout="responsive"
                objectFit="contain"
              />
            ) : (
              <p>Image non disponible</p>
            )}
          </div>
        ) : (
          <p>Aucune œuvre disponible</p>
        )}
      </div>

      <div className="home-paintings">
        {paintings.length > 0 ? (
          paintings.map((painting, index) => (
            <div
              key={index}
              className={`painting-row ${
                index % 2 === 0 ? "normal" : "reversed"
              }`}
            >
              <div className="text-content">
                <h2>{painting.title}</h2>
                <p>{painting.description}</p>
              </div>
              <div className="image-content">
                {painting.painting_url ? (
                  <Image
                    src={painting.painting_url}
                    alt={painting.description || "Œuvre"}
                    width={300}
                    height={300}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <p>Image non disponible</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Chargement des oeuvres...</p>
        )}
      </div>
    </>
  );
}
