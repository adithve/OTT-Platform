import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 6;
  const [error, setError] = useState("");
  const [watchlistIds, setWatchlistIds] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/movie-list/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setMovies(response.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies. Please login again.");
      }
    };

    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/watchlist/", {
          headers: { Authorization: `Token ${token}` },
        });
        const movieIds = response.data.map((item) => item.movie.id);
        setWatchlistIds(movieIds);
      } catch (err) {
        console.error("Error fetching watchlist:", err);
      }
    };

    fetchMovies();
    fetchWatchlist();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePosterClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleAddToWatchlist = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://127.0.0.1:8000/watchlist/add/${movieId}/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      setWatchlistIds([...watchlistIds, movieId]);
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      if (err.response && (err.response.status === 400 || err.response.status === 409)) {
        alert("Movie already exists in watchlist.");
        setWatchlistIds([...watchlistIds, movieId]);
      } else {
        alert("Failed to add to watchlist. Please try again.");
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
        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .search-bar {
          padding: 10px;
          width: 50%;
          border: 1px solid #ccc;
          border-radius: 20px;
          font-size: 16px;
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
        .add-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          color: #fff;
          border: none;
          font-size: 18px;
          padding: 8px 12px;
          border-radius: 50%;
          cursor: pointer;
          transition: 0.3s;
        }
        .pagination {
          margin-top: 30px;
          text-align: center;
        }
        .pagination button {
          margin: 0 5px;
          padding: 8px 12px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
        }
        .pagination .active {
          background: red;
          color: white;
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <p onClick={() => navigate("/change-password")}>Change Password</p>
        <p onClick={() => navigate("/watchlist")}>Watchlist</p>
        <p onClick={() => navigate("/watch-history")}>View History</p>
        <p
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <input
            type="text"
            placeholder="Search movies..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error ? (
          <p style={{ color: "red", marginTop: "20px" }}>{error}</p>
        ) : (
          <>
            <div className="movie-grid">
              {currentMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <img
                    src={`http://127.0.0.1:8000${movie.thumbnail}`}
                    alt={movie.title}
                    onClick={() => handlePosterClick(movie.id)}
                  />
                  <h4>{movie.title}</h4>
                  <button
                    className="add-btn"
                    style={{
                      background: watchlistIds.includes(movie.id) ? "green" : "red",
                    }}
                    onMouseEnter={(e) => {
                      if (!watchlistIds.includes(movie.id)) e.target.style.background = "#ff5555";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = watchlistIds.includes(movie.id) ? "green" : "red";
                    }}
                    onClick={() => handleAddToWatchlist(movie.id)}
                  >
                    {watchlistIds.includes(movie.id) ? "✓" : "+"}
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(filteredMovies.length / moviesPerPage) },
                (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={currentPage === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Homepage;
