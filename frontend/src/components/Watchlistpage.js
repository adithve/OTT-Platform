import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WatchlistPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch watchlist from API
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/watchlist/", {
          headers: { Authorization: `Token ${token}` },
        });
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  // Remove a movie from watchlist
  const handleRemove = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://127.0.0.1:8000/watchlist/remove/${movieId}/`,
        { headers: { Authorization: `Token ${token}` } }
      );

      setMovies(movies.filter((item) => item.movie.id !== movieId));
    } catch (error) {
      console.error("Error removing movie:", error);
      alert("Failed to remove movie from watchlist.");
    }
  };

  const handlePosterClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) return <p>Loading your watchlist...</p>;

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
        .movie-grid {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }
        .movie-card {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.3s;
          text-align: center;
          cursor: pointer;
        }
        .movie-card:hover {
          transform: scale(1.05);
        }
        .movie-card img {
          width: 180px;
          height: 270px;
          object-fit: cover;
          border-radius: 10px;
        }
        .movie-card h4 {
          margin-top: 10px;
          color: white;
        }
        .remove-btn {
          background: red;
          color: #fff;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 5px;
        }
        .remove-btn:hover {
          background: darkred;
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <p onClick={() => navigate("/home")}>Home</p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>My Watchlist</h2>
        {movies.length === 0 ? (
          <p>No movies in your watchlist.</p>
        ) : (
          <div className="movie-grid">
            {movies.map((item) => (
              <div key={item.id} className="movie-card">
                <img
                  src={`http://127.0.0.1:8000${item.movie.thumbnail}`}
                  alt={item.movie.title}
                  onClick={() => handlePosterClick(item.movie.id)}
                />
                <h4>{item.movie.title}</h4>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.movie.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
