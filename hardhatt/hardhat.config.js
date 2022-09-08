require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config({path:".env"});
require("dotenv").config()

const {API_URL,PRIVATE_KEY} = process.env;

module.exports = {
  solidity: "0.8.9",
  networks:{
    goerli: {
        url:API_URL,
        accounts: [PRIVATE_KEY]
    }
  }
};
