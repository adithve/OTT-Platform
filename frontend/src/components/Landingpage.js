import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const posters = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUAGDQl_wrhMYaaDKwtv0Oj7NvopV7h-IpA&s",
    "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_UF1000,1000_QL80_.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRISseUjtnWcf4MObsEFpEouqR-x833s2HliA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxf7dbCnSiSZdLCLw0BHTREw2xqgL4YtDWzDCvukHp6ifcspdveq_xsftAUMK7Gdih5g0&usqp=CAU",
    "https://m.media-amazon.com/images/I/71c05lTE03L._AC_UF1000,1000_QL80_.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpdZ318OXRGdJ1lrqhJsK7iBOrAkBl4hzzKA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUmfbScKIidOaK-zq_ca8ZuC4rpA7zdTazXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQY1J3Suv_JsSikKVKK6MXanlYTG4VHekCfQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRtXBYX7LtgNxjbfpODWfCJyBnfPaGMFUT6A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShVAw8bsApfBM5kS41Ypu1Hj284xKiFVkawA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSucrrvNrh5f9gEvxSF09xDV46zMHvTgJu5gw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJRQwEORdtTxpnGzqvU5OqeHbrVfGzSE0c1Q&s"
  ];

  const posterGrid = Array(40).fill(null).map((_, i) => posters[i % posters.length]);

  return (
    <div style={styles.container}>
      <div style={styles.posterGrid}>
        {posterGrid.map((poster, index) => (
          <img key={index} src={poster} alt="movie" style={styles.poster} />
        ))}
      </div>

      <div style={styles.overlay}>
        <h1 style={styles.heading} font ="TimesNewRoman" >BINGEBOX</h1>
        <button style={styles.button} onClick={() => navigate("/login")}>
          Start Streaming
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    color:"black",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  posterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)", 
    gridAutoRows: "1fr", 
    width: "100%",
    height: "100%",
  },
  poster: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: "0",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    padding: "20px",
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subheading: {
    fontSize: "1.5rem",
    marginBottom: "30px",
  },
  button: {
    background: "red",
    color: "white",
    fontSize: "1.25rem",
    padding: "15px 30px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};
