import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../config";
import MovieTicketABI from "../abi/MovieTicket.json";

export default function AddMovie({ signer, onMovieAdded }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");

  const addMovie = async () => {
    if (!signer) return alert("Connect your wallet first");
    if (!title || !price || !seats) return alert("Fill all fields");

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MovieTicketABI.abi, signer);
      const tx = await contract.addMovie(title, ethers.parseEther(price), parseInt(seats));
      await tx.wait();

      alert("Movie added successfully!");
      if (onMovieAdded) onMovieAdded(); // trigger movie list refresh

      setTitle("");
      setPrice("");
      setSeats("");
    } catch (err) {
      console.error(err);
      alert("Failed to add movie. Are you using the admin wallet?");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Add Movie</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Price (ETH)" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Seats" value={seats} onChange={(e) => setSeats(e.target.value)} />
      <button onClick={addMovie}>Add Movie</button>
    </div>
  );
}
