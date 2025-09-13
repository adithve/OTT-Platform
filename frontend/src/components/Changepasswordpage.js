import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/change-password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setMessage("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error changing password:", err);

      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.response && err.response.data.old_password) {
        setError(err.response.data.old_password);
      } else {
        setError("Failed to change password.");
      }
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "black",
        minHeight: "100vh",
        color: "white",
        display: "flex",
      }}
    >
      <style>{`
        .sidebar {
          width: 220px;
          background-color: #111;
          height: 100vh;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sidebar p {
          color: white;
          cursor: pointer;
          margin: 10px 0;
        }
        .sidebar p:hover {
          color: red;
        }
        .main-content {
          flex: 1;
          padding-left: 20px;
        }
        .form-container {
          max-width: 400px;
          margin: 50px auto;
          background-color: #1a1a1a;
          padding: 30px;
          border-radius: 10px;
        }
        .form-container h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .form-container input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 5px;
          border: none;
        }
        .form-container button {
          width: 100%;
          padding: 10px;
          background-color: red;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .success-msg {
          color: lightgreen;
          margin-bottom: 10px;
          text-align: center;
        }
        .error-msg {
          color: red;
          margin-bottom: 10px;
          text-align: center;
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <p onClick={() => navigate("/home")}>Home</p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="form-container">
          <h2>Change Password</h2>

          {message && <div className="success-msg">{message}</div>}
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleChangePassword}>
            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
