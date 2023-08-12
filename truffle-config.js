const fs = require('fs');

module.exports = {
  // ... other configuration options

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    }
  },

  compilers: {
    solc: {
      version: '0.8.19',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  contracts_build_directory: './frontend/src', // Specify the desired output directory
};
