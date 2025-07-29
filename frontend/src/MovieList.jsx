import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/v1/movies/?fields=full')
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Movie List</h2>
      <ul className="space-y-2">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className="bg-blue-100 hover:bg-blue-200 text-blue-900 px-4 py-2 rounded-md transition duration-200"
          >
            <span className="font-semibold">{movie.title}</span> —{' '}
            {movie.duration} mins
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;
