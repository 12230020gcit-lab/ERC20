// import React, { useEffect, useState, useCallback } from "react";
// import { ethers } from "ethers";
// import { CONTRACT_ADDRESS } from "../config";
// import MovieTicketABI from "../abi/MovieTicket.json";

// export default function MovieList({ provider, refresh }) {
//   const [movies, setMovies] = useState([]);

//   const fetchMovies = useCallback(async () => {
//     if (!provider) return;
//     try {
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, MovieTicketABI.abi, provider);
//       const count = await contract.movieCount();
//       const arr = [];
//       for (let i = 0; i < count; i++) {
//         const movie = await contract.getMovie(i);
//         arr.push({
//           id: i,
//           title: movie[0],
//           price: ethers.formatEther(movie[1]),
//           seats: movie[2].toString(),
//         });
//       }
//       setMovies(arr);
//     } catch (err) {
//       console.error("Error fetching movies:", err);
//     }
//   }, [provider]);

//   useEffect(() => {
//     fetchMovies();
//   }, [provider, fetchMovies, refresh]);

//   return (
//     <div style={{ marginTop: "20px" }}>
//       <h2>Movies</h2>
//       {movies.length === 0 && <p>No movies available.</p>}
//       {movies.map((m) => (
//         <div key={m.id} style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}>
//           <p>
//             <strong>ID:</strong> {m.id} | <strong>Title:</strong> {m.title} |{" "}
//             <strong>Price:</strong> {m.price} ETH | <strong>Seats:</strong> {m.seats}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }


"use client"

import { useEffect, useState, useCallback } from "react"
import { ethers } from "ethers"
import { Film, DollarSign, Users } from "lucide-react"
import { CONTRACT_ADDRESS } from "../config"
import MovieTicketABI from "../abi/MovieTicket.json"

export default function MovieList({ provider, refresh }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMovies = useCallback(async () => {
    if (!provider) return
    setLoading(true)
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MovieTicketABI.abi, provider)
      const count = await contract.movieCount()
      const arr = []
      for (let i = 0; i < count; i++) {
        const movie = await contract.getMovie(i)
        arr.push({
          id: i,
          title: movie[0],
          price: ethers.formatEther(movie[1]),
          seats: movie[2].toString(),
        })
      }
      setMovies(arr)
    } catch (err) {
      console.error("Error fetching movies:", err)
    } finally {
      setLoading(false)
    }
  }, [provider])

  useEffect(() => {
    fetchMovies()
  }, [provider, fetchMovies, refresh])

  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <Film size={24} />
          Available Movies
        </h2>
        <p className="card-subtitle">Browse and select movies to purchase tickets</p>
      </div>

      <div className="card-body">
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <Film size={48} />
            <p>No movies available yet</p>
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="movie-id">#{movie.id}</div>
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-details">
                  <div className="movie-detail">
                    <DollarSign size={16} />
                    <span>{movie.price} ETH</span>
                  </div>
                  <div className="movie-detail">
                    <Users size={16} />
                    <span>{movie.seats} seats</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
