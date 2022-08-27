import { useEffect } from 'react';
import useSWR from 'swr';

// Dont forget change the address to keccak-256>> https://emn178.github.io/online-tools/keccak_256
// and add here a new admin{s)
const adminAddresses = {
    '0x48f78ac25c02af28c64e5ea4d7e4c8536c562fac010a31c0cee0dc08bf5a70fd': true,
    '0xc072e248ab40517a5cbe6e4301b9d738a376dae612aa05f6f64be3a94631fe78': true
};
const handlerUseAccount = (web3, provider) => () => {
    const { mutate, data, ...rest } = useSWR(
        web3 ? 'web3/accounts' : null,
        async () => {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            if (!account) {
                throw new Error('No account found. Please refresh the browser');
            }
            return account;
        }
    );

    useEffect(() => {
        const mutator = (accounts) => {
            mutate(accounts[0] ?? null);
        };
        provider?.on('accountsChanged', mutator);

        return () => {
            provider?.removeListener('accountsChanged', mutator);
        };
    }, [mutate]);

    return {
        data,
        isAdmin: data && adminAddresses[web3.utils.keccak256(data)],
        mutate,
        ...rest
    };
};

export default handlerUseAccount;
