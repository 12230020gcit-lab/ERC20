# CineChain

**CineChain** is a blockchain-based movie ticket purchasing application. It allows users to buy movie tickets securely using blockchain technology, providing transparent and tamper-proof booking records. With CineChain, users can book tickets from anywhere, anytime, with full trust and zero risk of duplication or fraud.

---

## How to Use CineChain

1. Visit the official CineChain website.  
2. Browse the list of available movies.  
3. Select the movie you want to watch.  
4. Enter the number of tickets you want to buy.  
5. Click **Buy Tickets** and confirm the transaction using your wallet.  
   > **Note:** Your wallet must have sufficient ETH balance to complete the purchase.  
6. Once the payment is successful:
   - The available seats are automatically reduced.
   - Your purchased tickets are recorded on the blockchain.  
7. You can view the number of tickets you own for each movie in the **My Tickets** section.

---

## Admin Role (Movie Management)

The Admin is responsible for managing movie details.  

The Admin can:  
- Add a movie title  
- Set ticket price  
- Set available seats  
- Withdraw collected MTK tokens or ETH from the contract  

> **Note:** Only the contract owner (Admin) can perform these actions.

---

## Tech Stack

**Frontend**  
- React.js  
- Ethers.js – For blockchain interaction  
- MetaMask – Wallet connection  

**Smart Contract / Backend**  
- Hardhat – Development environment  
- Solidity – Smart contract language  
- Ethereum / Sepolia Testnet – Blockchain network  

---

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/12230020gcit-lab/ERC20.git
cd movie-ticketing

npm install --save-dev hardhat
npm install @nomiclabs/hardhat-ethers ethers
npm install @openzeppelin/contracts

cd movie-ticket-frontend
npm install

### 1. Clone the Repository
cd ../
npx hardhat compile

### Deploy to Local Hardhat Node
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

### Run Frontend
cd movie-ticket-frontend
npm start
