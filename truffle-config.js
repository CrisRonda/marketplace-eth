const HDWalletProvider = require('@truffle/hdwallet-provider');
const keys = require('./keys.json');
module.exports = {
    contracts_build_directory: './public/contracts',
    networks: {
        development: {
            host: '127.0.0.1', // Localhost (default: none)
            port: 7545, // Standard Ethereum port (default: none)
            network_id: '*' // Any network (default: none)
        },
        ropsten: {
            provider: () =>
                new HDWalletProvider({
                    mnemonic: {
                        phrase: `${keys.MNEMONIC}`
                    },
                    providerOrUrl: `https://ropsten.infura.io/v3/${keys.INFLURA_PROYECT_ID}`,
                    addressIndex: 0
                }),
            network_id: 3, // repsten id is 3, you can check it in Google
            gas: 5500000, // Gas limit, how much gas we are willing to spent
            /**
             * how much we are willing to spent for unit of gas
             * you can check the gas price here: https://etherchain.org/tools/gasnow
             * right now that price is 10 Gwei for fast transactions.
             * This value depends on how fast our transaction  will be in the chain
             */
            gasPrice: 20000000000,
            /**
             * Number of blocs to wait until deployment another contract
             */
            confirmations: 2,
            /**
             * Number of blocks before deployment times out
             */
            timeoutBlocks: 200
        }
    },
    compilers: {
        solc: {
            version: '0.8.12' // Fetch exact version from solc-bin (default: truffle's version)
        }
    }
};

/**
 * the max price to pay in order to deploy, this contract would be gas * gasPrice
 * In this case, right now, we have=>
 * 5500000 * 20000000000 = 110000000000000000 wei === 0.11 ETH ==> 162,72 USD (for 08/27/22)
 *
 * */
