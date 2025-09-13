import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Loginpage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err.message);

      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111",
        color: "white",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", marginBottom: "20px", width: "250px" }}
      />

      <button
        type="submit"
        onClick={handleLogin}
        style={{
          padding: "10px",
          background: "red",
          border: "none",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "5px",
          width: "17.5%",
        }}
      >
        Login
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
          {error}
        </p>
      )}

      <p style={{ fontSize: "14px" }}>
        New user?{" "}
        <span
          style={{
            color: "skyblue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/signup")}
        >
          Sign up here
        </span>
      </p>
    </div>
  );
}
