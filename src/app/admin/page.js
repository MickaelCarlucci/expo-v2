"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./page.css";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch("api/messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        setError("erreur lors de la récupération des messages");
        console.error("erreur lors de la récupération des messages:", error);
      }
    }
    fetchMessages();
  }, []);
  return (
    <>
      <div className="div-messages">
        {error && <p className="error">{error}</p>}
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <p key={index}>
              <Link href={`/admin/message/${msg.id}`}>
                {msg.message.length > 20
                  ? msg.message.substring(0, 20) + "..."
                  : msg.message}
              </Link>
            </p> // Tronquer à 20 caractères
          ))
        ) : (
          <p>Chargement des messages...</p> // Message de chargement
        )}
      </div>
    </>
  );
}
