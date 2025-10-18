// import React, { useState } from "react";
// import { ethers } from "ethers";
// import AddMovie from "./components/AddMovie";
// import MovieList from "./components/MovieList";
// import BuyTicket from "./components/BuyTicket";

// function App() {
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [refreshMovies, setRefreshMovies] = useState(0); // trigger re-render

//   const connectWallet = async () => {
//     if (window.ethereum) {
//       try {
//         const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//         const tempProvider = new ethers.BrowserProvider(window.ethereum);
//         const tempSigner = await tempProvider.getSigner();

//         setProvider(tempProvider);
//         setSigner(tempSigner);
//         setAccount(accounts[0]);
//       } catch (error) {
//         console.error("Wallet connection failed:", error);
//         alert("Wallet connection failed");
//       }
//     } else {
//       alert("Install MetaMask!");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Movie Ticket DApp</h1>

//       {!provider && <button onClick={connectWallet}>Connect Wallet</button>}

//       {provider && (
//         <>
//           <p>Connected Wallet: <strong>{account}</strong></p>

//           {/* Add Movie (Admin) */}
//           <AddMovie
//             signer={signer}
//             onMovieAdded={() => setRefreshMovies(prev => prev + 1)}
//           />

//           {/* Movie List */}
//           <MovieList
//             provider={provider}
//             refresh={refreshMovies}
//           />

//           {/* Buy Ticket */}
//           <BuyTicket signer={signer} />
//         </>
//       )}
//     </div>
//   );
// }

// export default App;


"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Wallet, Film } from "lucide-react"
import AddMovie from "./components/AddMovie"
import MovieList from "./components/MovieList"
import BuyTicket from "./components/BuyTicket"
import "./App.css"

function App() {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [account, setAccount] = useState(null)
  const [refreshMovies, setRefreshMovies] = useState(0)

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const tempProvider = new ethers.BrowserProvider(window.ethereum)
        const tempSigner = await tempProvider.getSigner()

        setProvider(tempProvider)
        setSigner(tempSigner)
        setAccount(accounts[0])
      } catch (error) {
        console.error("Wallet connection failed:", error)
        alert("Wallet connection failed")
      }
    } else {
      alert("Install MetaMask!")
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Film size={32} />
            <h1>CineChain</h1>
          </div>
          {!provider ? (
            <button className="btn btn-primary" onClick={connectWallet}>
              <Wallet size={18} />
              Connect Wallet
            </button>
          ) : (
            <div className="wallet-info">
              <span className="wallet-address">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        {!provider ? (
          <div className="welcome-section">
            <div className="welcome-card">
              <Film size={64} className="welcome-icon" />
              <h2>Welcome to CineChain</h2>
              <p>Your decentralized movie ticket marketplace</p>
              <button className="btn btn-primary btn-large" onClick={connectWallet}>
                <Wallet size={20} />
                Connect Your Wallet to Get Started
              </button>
            </div>
          </div>
        ) : (
          <div className="dashboard">
            <AddMovie signer={signer} onMovieAdded={() => setRefreshMovies((prev) => prev + 1)} />

            <MovieList provider={provider} refresh={refreshMovies} />

            <BuyTicket signer={signer} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Ethereum Blockchain</p>
      </footer>
    </div>
  )
}

export default App
