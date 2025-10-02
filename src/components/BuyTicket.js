/* global BigInt */
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../config";
import MovieTicketABI from "../abi/MovieTicket.json";

export default function BuyTicket({ signer }) {
  const [movieId, setMovieId] = useState("");
  const [count, setCount] = useState("");
  const [movies, setMovies] = useState([]);
  const [purchase, setPurchase] = useState(null);

  // Load all movies
  useEffect(() => {
    const fetchMovies = async () => {
      if (!signer) return;
      try {
        const provider = signer.provider;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, MovieTicketABI.abi, provider);
        const movieCount = await contract.movieCount();
        const arr = [];
        for (let i = 0; i < movieCount; i++) {
          const movie = await contract.getMovie(i);
          arr.push({
            id: i,
            title: movie[0],
            price: BigInt(movie[1]), // price in wei
            seats: parseInt(movie[2]),
          });
        }
        setMovies(arr);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, [signer]);

  const buyTicket = async () => {
    if (!signer) return alert("Connect your wallet first");

    const index = parseInt(movieId);
    const ticketCount = parseInt(count);

    if (isNaN(index) || isNaN(ticketCount) || ticketCount <= 0) {
      return alert("Enter valid Movie ID and ticket count");
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MovieTicketABI.abi, signer);
      const movie = await contract.getMovie(index);

      const pricePerTicket = BigInt(movie[1]); // already in wei
      const total = pricePerTicket * BigInt(ticketCount);

      // Wallet balance check
      const address = await signer.getAddress();
      const balance = await signer.provider.getBalance(address);

      console.log("Wallet balance (ETH):", ethers.formatEther(balance));
      console.log("Total to pay (ETH):", ethers.formatEther(total));

      if (balance < total) return alert("Insufficient funds in your wallet");

      // Buy tickets
      const tx = await contract.buyTicket(index, ticketCount, { value: total });
      await tx.wait();

      // Generate seat numbers (simple example)
      const totalSeats = parseInt(movie[2]);
      const startSeat = totalSeats - ticketCount + 1;
      const seatNumbers = Array.from({ length: ticketCount }, (_, i) => startSeat + i);

      setPurchase({
        title: movie[0],
        price: ethers.formatEther(pricePerTicket),
        count: ticketCount,
        seats: seatNumbers,
      });

      // Clear inputs
      setMovieId("");
      setCount("");

      alert("Tickets bought successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to buy tickets");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Buy Ticket</h2>

      <input
        placeholder="Movie ID"
        value={movieId}
        onChange={(e) => setMovieId(e.target.value)}
      />
      <input
        placeholder="Number of tickets"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <button onClick={buyTicket}>Buy</button>

      {/* Display purchase details */}
      {purchase && (
        <div style={{ marginTop: "15px", border: "1px solid #ccc", padding: "10px" }}>
          <h3>Purchase Details</h3>
          <p><strong>Movie:</strong> {purchase.title}</p>
          <p><strong>Price per ticket:</strong> {purchase.price} ETH</p>
          <p><strong>Number of tickets:</strong> {purchase.count}</p>
          <p><strong>Seats:</strong> {purchase.seats.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
