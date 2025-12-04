CineChain

Blockchain-based movie ticket purchasing application. Buy movie tickets securely using blockchain technology and get transparent, tamper-proof booking records. With CineChain, users can book movie tickets from anywhere at any time with full trust and zero risk of duplication or fraud.

How to Use CineChain

1.Visit the official CineChain website.

2.Browse the list of available movies.

3.Select the movie you want to watch.

4.Enter the number of tickets you want to buy.

5.Click on Buy Tickets and confirm the transaction using your wallet.
(Note: Your wallet must have sufficient ETH balance to complete the purchase.)

6.Once the payment is successful:

The available seats are automatically reduced.

Your purchased tickets are recorded on the blockchain.

7.You can view the number of tickets you own for each movie on the My Tickets section.


Admin Role (Movie Management)

The Admin is responsible only for adding movie details.

The Admin can:

Add movie title

Set ticket price

Set available seats

The Admin cannot buy tickets as a user and cannot modify user data, ensuring a clear separation of roles and better security.



Tech Stack
1. Frontend

React.js

Ethers.js – For blockchain interaction

MetaMask – Wallet connection

2. Smart Contract

Hardhat – Development environment

Solidity – Smart contract language

Ethereum / Sepolia Testnet – Blockchain network

Project Setup
1.Open the Project
code .

2.smart contract setup
cd movie-ticketing
npm i

3.compile smart contracts
npx hardhat compile

4.Run test
npx hardhat test


5.Deploying to sepolia Testnet
npx hardhat node

6.Deploy contract
npx hardhat run scripts/deploy.js --network sepolia

7.Frontend setup
cd movie-ticketing-frontend
npm i

8.Start development server 
npm start



