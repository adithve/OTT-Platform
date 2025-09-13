import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Moviepage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false); 

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:8000/movie/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setMovie(response.data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again.");
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleAddToHistory = async () => {
    if (hasPlayed) return; // Prevent repeated calls
    setHasPlayed(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://127.0.0.1:8000/watch-history/add/${id}/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
    } catch (err) {
      console.error("Error adding to history:", err);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!movie) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
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
          padding: 20px;
        }
        .back-btn {
          background: red;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .movie-details {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .movie-details img {
          width: 250px;
          border-radius: 10px;
        }
        .movie-details h1 {
          margin: 0;
        }
        video {
          border-radius: 10px;
          width: 100%;
          max-height: 400px;
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <p onClick={() => navigate("/home")}>Home</p>
        <p onClick={() => navigate("/watchlist")}>Watchlist</p>
        <p onClick={() => navigate("/history")}>View History</p>
        
      </div>

      {/* Main Content */}
      <div className="main-content">
        <button className="back-btn" onClick={() => navigate("/home")}>
           Back
        </button>

        <div className="movie-details">
          <img
            src={`http://127.0.0.1:8000${movie.thumbnail}`}
            alt={movie.title}
          />
          <div>
            <h1>{movie.title}</h1>
            <p><strong>Language:</strong> {movie.language}</p>
            <p>{movie.description}</p>
          </div>
        </div>

        {movie.video && (
          <div style={{ marginTop: "30px" }}>
            <h2>Watch Movie</h2>
            <video
              controls
              onPlay={handleAddToHistory} 
            >
              <source src={`http://127.0.0.1:8000${movie.video}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
};

export default Moviepage;
