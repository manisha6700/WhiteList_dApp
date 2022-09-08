const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contract,
  so whitelistContract here is a factory for instances of our whitelist contract.
  Whitelist wale sol file se yeh whitelist contarct laya
  */
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  //here we deploy the contract
  const deployedWhitelistContract = await whitelistContract.deploy(10);
  //10 is the max number of whitelisted addresses allowed

  await deployedWhitelistContract.deployed();

  //print the address of the deployed contract
  console.log("Whitelist Contract Address:", deployedWhitelistContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
