const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const MovieToken = await hre.ethers.getContractFactory("MovieToken");
  const contract = await MovieToken.deploy();

  // In Ethers v6, address is available directly
  console.log("MovieToken deployed to:", contract.target || contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
