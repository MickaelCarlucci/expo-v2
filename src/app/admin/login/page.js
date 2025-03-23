"use client";
import { useState } from "react";

export default function Page() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <>
      <div className="div-form-login">
        <form className="form-login"></form>
      </div>
    </>
  );
}
