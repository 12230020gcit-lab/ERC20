import { expect } from "chai";
import HardhatPkg from "hardhat";
const { ethers } = HardhatPkg;

describe("MovieTicket", function () {
  let movieTicket, owner, alice, bob;

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    const MovieTicket = await ethers.getContractFactory("MovieTicket");
    movieTicket = await MovieTicket.deploy();
  });

  it("owner can add a movie", async () => {
    await expect(
      movieTicket.connect(owner).addMovie("Avengers", ethers.parseEther("0.01"), 50)
    ).to.emit(movieTicket, "MovieAdded");

    const movie = await movieTicket.getMovie(0);
    expect(movie.title).to.equal("Avengers");
    expect(movie.price).to.equal(ethers.parseEther("0.01"));
    expect(movie.seats).to.equal(50);
  });

  it("user can buy tickets and seats decrease", async () => {
    await movieTicket.addMovie("Avengers", ethers.parseEther("0.01"), 50);
    await movieTicket.connect(alice).buyTicket(0, 2, { value: ethers.parseEther("0.02") });

    const tickets = await movieTicket.ticketsOf(alice.address, 0);
    expect(tickets).to.equal(2);

    const movie = await movieTicket.getMovie(0);
    expect(movie.seats).to.equal(48);

    expect(await ethers.provider.getBalance(movieTicket.target)).to.equal(ethers.parseEther("0.02"));
  });

  it("reverts on insufficient funds", async () => {
    await movieTicket.addMovie("Avengers", ethers.parseEther("0.01"), 2);
    await expect(
      movieTicket.connect(alice).buyTicket(0, 2, { value: ethers.parseEther("0.01") })
    ).to.be.revertedWith("Incorrect ETH sent");
  });

  it("reverts when not enough seats", async () => {
    await movieTicket.addMovie("Avengers", ethers.parseEther("0.01"), 1);
    await expect(
      movieTicket.connect(alice).buyTicket(0, 2, { value: ethers.parseEther("0.02") })
    ).to.be.revertedWith("Not enough seats");
  });

  it("owner can withdraw funds", async () => {
    await movieTicket.addMovie("Avengers", ethers.parseEther("0.01"), 50);
    await movieTicket.connect(alice).buyTicket(0, 1, { value: ethers.parseEther("0.01") });

    expect(await ethers.provider.getBalance(movieTicket.target)).to.equal(ethers.parseEther("0.01"));

    await movieTicket.withdraw();
    expect(await ethers.provider.getBalance(movieTicket.target)).to.equal(0);
  });
});
