import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./create-account.css";
import backgroundImage from "../../assets/debate.png";

export const CreateAccount = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:3000/auth/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!res.ok) {
        setError("Erro ao criar conta");
        return;
      }

      setSuccess("Conta criada com sucesso! Redirecionando para login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div
      className="create-premium-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="create-premium-overlay"></div>

      <div className="create-premium-box">
        <div className="create-premium-logo">⚖</div>
        <h1 className="create-premium-title">Sociedade de Debates - UNI7</h1>
        <p className="create-premium-subtitle">Criar Conta</p>

        <input
          className="create-premium-input"
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="create-premium-input"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="create-premium-input"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button className="create-premium-btn" onClick={handleCreate}>
          Criar Conta
        </button>

        {error && (
          <p className="create-premium-message" style={{ color: "#ff6b6b" }}>
            {error}
          </p>
        )}
        {success && (
          <p className="create-premium-message" style={{ color: "#a3e635" }}>
            {success}
          </p>
        )}

      </div>
    </div>
  );
};
