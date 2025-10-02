import React, { useState } from "react";
import { ethers } from "ethers";
import AddMovie from "./components/AddMovie";
import MovieList from "./components/MovieList";
import BuyTicket from "./components/BuyTicket";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [refreshMovies, setRefreshMovies] = useState(0); // trigger re-render

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();

        setProvider(tempProvider);
        setSigner(tempSigner);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Wallet connection failed");
      }
    } else {
      alert("Install MetaMask!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movie Ticket DApp</h1>

      {!provider && <button onClick={connectWallet}>Connect Wallet</button>}

      {provider && (
        <>
          <p>Connected Wallet: <strong>{account}</strong></p>

          {/* Add Movie (Admin) */}
          <AddMovie
            signer={signer}
            onMovieAdded={() => setRefreshMovies(prev => prev + 1)}
          />

          {/* Movie List */}
          <MovieList
            provider={provider}
            refresh={refreshMovies}
          />

          {/* Buy Ticket */}
          <BuyTicket signer={signer} />
        </>
      )}
    </div>
  );
}

export default App;
