import { useEffect } from 'react';
import useSWR from 'swr';

const NETWORKS = {
    1: 'Ethereum Mainnet',
    3: 'Ropsten Testnet',
    4: 'Rinkeby Testnet',
    5: 'Goerli Testnet',
    42: 'Kovan Testnet',
    56: 'Binance Smart Chain',
    1337: 'Ganache Testnet'
};

const handlerUseNetwork = (web3, provider) => {
    return () => {
        const {
            mutate,
            data = '',
            ...rest
        } = useSWR(web3 && 'web3/network', async () => {
            const networkName = await web3.eth.getChainId();
            return NETWORKS[networkName];
        });

        useEffect(() => {
            provider &&
                provider.on('chainChanged', (chainId) =>
                    mutate(NETWORKS[chainId])
                );
        }, [provider]);

        return {
            network: {
                data,
                mutate,
                ...rest
            }
        };
    };
};

export default handlerUseNetwork;
