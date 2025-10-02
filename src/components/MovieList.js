import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../config";
import MovieTicketABI from "../abi/MovieTicket.json";

export default function MovieList({ provider, refresh }) {
  const [movies, setMovies] = useState([]);

  const fetchMovies = useCallback(async () => {
    if (!provider) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MovieTicketABI.abi, provider);
      const count = await contract.movieCount();
      const arr = [];
      for (let i = 0; i < count; i++) {
        const movie = await contract.getMovie(i);
        arr.push({
          id: i,
          title: movie[0],
          price: ethers.formatEther(movie[1]),
          seats: movie[2].toString(),
        });
      }
      setMovies(arr);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  }, [provider]);

  useEffect(() => {
    fetchMovies();
  }, [provider, fetchMovies, refresh]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Movies</h2>
      {movies.length === 0 && <p>No movies available.</p>}
      {movies.map((m) => (
        <div key={m.id} style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}>
          <p>
            <strong>ID:</strong> {m.id} | <strong>Title:</strong> {m.title} |{" "}
            <strong>Price:</strong> {m.price} ETH | <strong>Seats:</strong> {m.seats}
          </p>
        </div>
      ))}
    </div>
  );
}
