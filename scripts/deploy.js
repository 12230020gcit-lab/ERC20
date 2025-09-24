import HardhatPkg from "hardhat";
const { ethers } = HardhatPkg;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const MovieTicket = await ethers.getContractFactory("MovieTicket");
  const movieTicket = await MovieTicket.deploy(); // no arguments needed
  await movieTicket.waitForDeployment();

  console.log("MovieTicket deployed to:", movieTicket.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
