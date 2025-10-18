// import React, { useState } from "react";
// import { ethers } from "ethers";
// import { CONTRACT_ADDRESS } from "../config";
// import MovieTicketABI from "../abi/MovieTicket.json";

// export default function AddMovie({ signer, onMovieAdded }) {
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [seats, setSeats] = useState("");

//   const addMovie = async () => {
//     if (!signer) return alert("Connect your wallet first");
//     if (!title || !price || !seats) return alert("Fill all fields");

//     try {
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, MovieTicketABI.abi, signer);
//       const tx = await contract.addMovie(title, ethers.parseEther(price), parseInt(seats));
//       await tx.wait();

//       alert("Movie added successfully!");
//       if (onMovieAdded) onMovieAdded(); // trigger movie list refresh

//       setTitle("");
//       setPrice("");
//       setSeats("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add movie. Are you using the admin wallet?");
//     }
//   };

//   return (
//     <div style={{ marginTop: "20px" }}>
//       <h2>Add Movie</h2>
//       <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
//       <input placeholder="Price (ETH)" value={price} onChange={(e) => setPrice(e.target.value)} />
//       <input placeholder="Seats" value={seats} onChange={(e) => setSeats(e.target.value)} />
//       <button onClick={addMovie}>Add Movie</button>
//     </div>
//   );
// }


"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { PlusCircle, Film, DollarSign, Users } from "lucide-react"
import { CONTRACT_ADDRESS } from "../config"
import MovieTicketABI from "../abi/MovieTicket.json"

export default function AddMovie({ signer, onMovieAdded }) {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [seats, setSeats] = useState("")
  const [loading, setLoading] = useState(false)

  const addMovie = async () => {
    if (!signer) return alert("Connect your wallet first")
    if (!title || !price || !seats) return alert("Fill all fields")

    setLoading(true)
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MovieTicketABI.abi, signer)
      const tx = await contract.addMovie(title, ethers.parseEther(price), Number.parseInt(seats))
      await tx.wait()

      alert("Movie added successfully!")
      if (onMovieAdded) onMovieAdded()

      setTitle("")
      setPrice("")
      setSeats("")
    } catch (err) {
      console.error(err)
      alert("Failed to add movie. Are you using the admin wallet?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <PlusCircle size={24} />
          Add New Movie
        </h2>
        <p className="card-subtitle">Admin only - Add movies to the platform</p>
      </div>

      <div className="card-body">
        <div className="form-group">
          <label>
            <Film size={18} />
            Movie Title
          </label>
          <input
            type="text"
            className="input"
            placeholder="Enter movie title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <DollarSign size={18} />
              Price (ETH)
            </label>
            <input
              type="text"
              className="input"
              placeholder="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              <Users size={18} />
              Available Seats
            </label>
            <input
              type="number"
              className="input"
              placeholder="100"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <button className="btn btn-primary btn-block" onClick={addMovie} disabled={loading}>
          {loading ? "Adding Movie..." : "Add Movie"}
        </button>
      </div>
    </div>
  )
}
