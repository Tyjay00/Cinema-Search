import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import SearchIcon from './search.svg';
import logo from './logo.png';
import './App.css';

const API_URL = 'https://www.omdbapi.com?apikey=f4532191';

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    searchMovies("Batman", 1);
  }, []);

  const searchMovies = async (title, page = 1) => {
    try {
      const response = await fetch(`${API_URL}&s=${title}&page=${page}`);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
        setTotalResults(Number(data.totalResults));
        setCurrentPage(page);
      } else {
        setMovies([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchMovieDetails = async (id) => {
    try {
      const response = await fetch(`${API_URL}&i=${id}`);
      const data = await response.json();

      if (data.Response === 'True') {
        setSelectedMovie(data);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchMovies(searchTerm, 1);
    }
  };

  const resetPage = () => {
    setSearchTerm("");
    setSelectedMovie(null);
    searchMovies("Batman", 1);
  };

  // Determine if there are more pages (OMDb returns 10 results per page)
  const hasNextPage = currentPage * 10 < totalResults;

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="header">
        <a href="/" className="logo" onClick={(e) => { e.preventDefault(); resetPage(); }}>
          <img src={logo} alt="Cinema Search" />
          CinemaSearch
        </a>
        
        <nav className="nav-links">
          <a href="#movies" className="nav-link">Movies</a>
          <a href="#tv" className="nav-link">TV Shows</a>
          <a href="#top" className="nav-link">Top IMDb</a>
        </nav>

        <div className="theme-buttons">
          <button 
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="search-container">
        <div className="search">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for movies, TV shows..."
          />
          <button 
            className="search-button"
            onClick={() => searchMovies(searchTerm, 1)}
          >
            <img src={SearchIcon} alt="Search" />
          </button>
        </div>
      </div>

      {selectedMovie ? (
        <div className="movie-details">
          <div className="detail-poster">
            <img 
              src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : 'https://via.placeholder.com/400'}
              alt={selectedMovie.Title}
            />
          </div>
          <div className="detail-content">
            <h1>{selectedMovie.Title} ({selectedMovie.Year})</h1>
            <div className="metadata">
              <span className="rating">⭐ {selectedMovie.imdbRating || 'N/A'}</span>
              <span className="runtime">{selectedMovie.Runtime || 'N/A'}</span>
              <span className="genre">{selectedMovie.Genre || 'N/A'}</span>
            </div>
            <p className="plot">{selectedMovie.Plot}</p>
            <div className="cast-crew">
              <div className="cast">
                <h3>Cast:</h3>
                <p>{selectedMovie.Actors || 'N/A'}</p>
              </div>
              <div className="crew">
                <h3>Director:</h3>
                <p>{selectedMovie.Director || 'N/A'}</p>
              </div>
            </div>
            <button 
              className="download-btn"
              onClick={() => alert('Download coming soon!')}
            >
              Download Movie
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.imdbID} 
                movie={movie} 
                showDetails={fetchMovieDetails}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
          {/* Pagination Buttons */}
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            {currentPage > 1 && (
              <button 
                onClick={() => searchMovies(searchTerm || "Batman", currentPage - 1)}
                style={{
                  padding: '10px 20px',
                  fontSize: '1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  background: 'var(--primary-color)',
                  border: 'none',
                  marginRight: '1rem'
                }}
              >
                Back
              </button>
            )}
            {hasNextPage && (
              <button 
                onClick={() => searchMovies(searchTerm || "Batman", currentPage + 1)}
                style={{
                  padding: '10px 20px',
                  fontSize: '1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  background: 'var(--primary-color)',
                  border: 'none'
                }}
              >
                Next
              </button>
            )}
          </div>
        </>
      )}

      <footer className="footer">
        <p>© {new Date().getFullYear()} Cinema Search.Tyrone Joel</p>
      </footer>
    </div>
  );
};

export default App;

