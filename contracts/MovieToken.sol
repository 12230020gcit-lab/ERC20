// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MovieToken is ERC20, Ownable {

    struct Movie {
        uint256 id;
        string title;
        uint256 price;       // price per ticket in MTK tokens
        uint256 availableSeats;
        bool exists;
    }

    mapping(uint256 => Movie) public movies;
    uint256 public movieCount;


    event MovieAdded(uint256 movieId, string title, uint256 price, uint256 seats);
    event TicketPurchased(uint256 movieId, address buyer, uint256 quantity);

    uint256 public tokenPrice = 0.01 ether; // 1 MTK = 0.01 ETH

    constructor() ERC20("MovieToken", "MTK") Ownable(msg.sender) {}


    function buyTokens(uint256 amount) external payable {
        require(amount > 0, "Amount must be > 0");
        uint256 cost = tokenPrice * amount;
        require(msg.value >= cost, "Insufficient ETH sent");

        _mint(msg.sender, amount * 10 ** decimals());

        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost); // refund extra ETH
        }
    }

    function addMovie(string memory title, uint256 price, uint256 seats) external onlyOwner {
        require(price > 0 && seats > 0, "Invalid price or seats");

        movieCount++;
        movies[movieCount] = Movie({
            id: movieCount,
            title: title,
            price: price * 10 ** decimals(),
            availableSeats: seats,
            exists: true
        });

        emit MovieAdded(movieCount, title, price, seats);
    }


    function buyTicket(uint256 movieId, uint256 quantity) external {
        Movie storage movie = movies[movieId];
        require(movie.exists, "Movie does not exist");
        require(quantity > 0 && quantity <= movie.availableSeats, "Not enough seats");

        uint256 totalCost = movie.price * quantity;
        require(balanceOf(msg.sender) >= totalCost, "Insufficient MTK balance");

        _transfer(msg.sender, address(this), totalCost); // transfer MTK to contract
        movie.availableSeats -= quantity;                // reduce available seats

        emit TicketPurchased(movieId, msg.sender, quantity);
    }


    function getMovie(uint256 movieId) external view returns (
        string memory title,
        uint256 price,
        uint256 availableSeats
    ) {
        Movie storage movie = movies[movieId];
        require(movie.exists, "Movie does not exist");
        return (movie.title, movie.price, movie.availableSeats);
    }


    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        _transfer(address(this), owner(), amount);
    }
}


//When a user buys a ticket, their MTK tokens are transferred to the contract as payment. The admin can later withdraw these tokens. Burning is only needed if you want the tokens to disappear, but in my system, MTK is meant to be a payment token, so burning is not required.