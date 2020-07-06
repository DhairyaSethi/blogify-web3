const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "e0545923a679490dbad2b378f01621ac";
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/YOUR-PROJECT-ID`),
      network_id: 4,       
      gas: 4500000, 
      gasPrice: 10000000000,       
    },
  },
}
