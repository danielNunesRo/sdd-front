import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sddImage from "../../assets/sdd.jpg";
import { Link } from "react-router-dom";
import "./login.css"

export const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        setError("Credenciais inválidas");
        return;
      }

      const data = await res.json();

      localStorage.setItem("access_token", data.access_token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="container">
      <div className="imagem">
        <img src={sddImage} alt="Sociedade de Debates" />
      </div>
      <div className="login-box">
        <h1>Faça o login</h1>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
        <div className="login-links">
          <a href="#">Esqueci a senha</a>
          <Link to="/create">Criar conta</Link>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};
