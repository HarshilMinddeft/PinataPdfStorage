require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      gasPrice: 10000000000,
      accounts: {
        mnemonic: `pride year nut venue fatal trouble possible gown tent dream gorilla ridge`,
      },
    },
  },
  etherscan: {
    //bsc api key from bscScan
    // apiKey: bscscanApiKey,
  },
  paths: {
    artifacts: "./my-app/src/artifacts",
  },
};
