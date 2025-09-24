// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MovieTicket is Ownable {
    constructor() Ownable(msg.sender) {}  // pass deployer as owner

    struct Movie {
        string title;
        uint256 price;
        uint256 availableSeats;
        bool exists;
    }

    mapping(uint256 => Movie) private movies;
    uint256 public movieCount;

    mapping(address => mapping(uint256 => uint256)) private ticketsBought;

    event MovieAdded(uint256 indexed movieId, string title, uint256 price, uint256 seats);
    event TicketPurchased(address indexed buyer, uint256 indexed movieId, uint256 count, uint256 totalPaid);
    event Withdraw(address indexed owner, uint256 amount);

    function addMovie(string calldata title, uint256 price, uint256 seats) external onlyOwner {
        require(bytes(title).length > 0, "Title required");
        require(price > 0, "Price must be > 0");
        require(seats > 0, "Seats must be > 0");

        movies[movieCount] = Movie(title, price, seats, true);
        emit MovieAdded(movieCount, title, price, seats);
        movieCount += 1;
    }

    function buyTicket(uint256 movieId, uint256 seatCount) external payable {
        require(seatCount > 0, "Must buy at least 1 ticket");
        require(movies[movieId].exists, "Movie does not exist");

        Movie storage m = movies[movieId];
        require(m.availableSeats >= seatCount, "Not enough seats");

        uint256 totalPrice = m.price * seatCount;
        require(msg.value == totalPrice, "Incorrect ETH sent");

        m.availableSeats -= seatCount;
        ticketsBought[msg.sender][movieId] += seatCount;

        emit TicketPurchased(msg.sender, movieId, seatCount, msg.value);
    }

    function getMovie(uint256 movieId) external view returns (string memory title, uint256 price, uint256 seats) {
        require(movies[movieId].exists, "Movie does not exist");
        Movie storage m = movies[movieId];
        return (m.title, m.price, m.availableSeats);
    }

    function ticketsOf(address buyer, uint256 movieId) external view returns (uint256) {
        return ticketsBought[buyer][movieId];
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
        emit Withdraw(owner(), balance);
    }
}
