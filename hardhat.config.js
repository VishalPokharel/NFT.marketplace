require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require("fs");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

PRIVATE_KEY = "rNkR-PZX6tlDP_JMz-DAeQohKWoU8o7q";
PRIVATE_API_URL = "https://polygon-mumbai.g.alchemy.com/v2/rNkR-PZX6tlDP_JMz-DAeQohKWoU8o7q";
REACT_APP_PINATA_KEY = "c3da23146c157a78fe53"
REACT_APP_PINATA_SECRET = "7b131de1b8bf586b6ec285e7c9439da3eb25a70a70246e19c5c54ea6f1e1c29a"


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/rNkR-PZX6tlDP_JMz-DAeQohKWoU8o7q",
      accounts: ["e0a0438a366470b56bba75a181b6db597ec4bbcc227875c7e0d329099be95e14",],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
