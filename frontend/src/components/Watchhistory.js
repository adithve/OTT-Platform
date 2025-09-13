import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WatchHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/watch-history/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching watch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handlePosterClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <p>Loading your watch history...</p>;

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
          background-color: #1a1a1a;
          padding-bottom: 10px;
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
        .watch-date {
          margin-top: 5px;
          color: #ccc;
          font-size: 14px;
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <p onClick={() => navigate("/home")}>Home</p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>My Watch History</h2>
        {history.length === 0 ? (
          <p>No movies watched yet.</p>
        ) : (
          <div className="movie-grid">
            {history.map((item) => (
              <div key={item.id} className="movie-card">
                <img
                  src={`http://127.0.0.1:8000${item.movie.thumbnail}`}
                  alt={item.movie.title}
                  onClick={() => handlePosterClick(item.movie.id)}
                />
                <h4>{item.movie.title}</h4>
                <div className="watch-date">
                  Watched on: {formatDate(item.watched_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
