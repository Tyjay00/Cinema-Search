// MovieCard.js
import React, { useState } from 'react';

const MovieCard = ({ movie, showDetails }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = (e) => {
    e.stopPropagation();
    // Implement download logic here
    alert('Download feature coming soon!');
  };

  return (
    <div 
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => showDetails(movie.imdbID)}
    >
      <img 
        className="poster"
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400"}
        alt={movie.Title}
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">{movie.Year}</p>
        <div className="rating">
          <span className="imdb-rating">⭐ {movie.imdbRating || 'N/A'}</span>
        </div>
        {isHovered && (
          <button className="download-btn" onClick={handleDownload}>
            Download
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
