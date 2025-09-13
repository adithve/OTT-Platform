// frontend/src/components/IntroAnimation.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IntroAnimation.css";

export default function IntroAnimation() {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      navigate("/landing");
    }, 3000); // duration of animation
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!show) return null;

  return (
    <div className="intro-container">
      <div className="logo">BINGEBOX</div>
    </div>
  );
}
