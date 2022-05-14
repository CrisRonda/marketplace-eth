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
const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID];

const handlerUseNetwork = (web3, provider) => {
    return () => {
        const {
            mutate,
            data = '',
            ...rest
        } = useSWR(web3 && 'web3/network', async () => {
            const networkName = await web3.eth.getChainId();
            if (!networkName) {
                throw new Error('No network found. Please refresh the browser');
            }
            return NETWORKS[networkName];
        });

        useEffect(() => {
            provider &&
                provider.on('chainChanged', (chainId) =>
                    mutate(NETWORKS[chainId])
                );
        }, [provider]);

        return {
            data,
            isSupported: data === targetNetwork,
            mutate,
            targetNetwork,
            ...rest
        };
    };
};

export default handlerUseNetwork;
