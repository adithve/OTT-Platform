import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signuppage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/signup/", {
    name: formData.name,
    email: formData.email,
    password: formData.password,
  });
      alert(res.data.message);
      navigate("/login"); 
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={containerStyle}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input name="name" type="text" placeholder="Name" style={inputStyle} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" style={inputStyle} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" style={inputStyle} onChange={handleChange} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" style={inputStyle} onChange={handleChange} />

        <button style={buttonStyle}>Signup</button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Existing user?{" "}
        <Link to="/login" style={{ color: "lightblue", textDecoration: "underline" }}>
          Login
        </Link>
      </p>
    </div>
  );
}

const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#111",
  color: "#fff",
  flexDirection: "column",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "280px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const buttonStyle = {
  background: "red",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginBottom: "15px",
};
