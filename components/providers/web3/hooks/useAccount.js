import { useEffect } from 'react';
import useSWR from 'swr';

const adminAddresses = {
    '0xe7bd02deb6e9cac2741bfffa7523adf247b7466058e9d15b00fd5d44cabc21ea': true
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
        provider &&
            provider?.on('accountsChanged', (accounts) => {
                mutate(accounts[0]);
            });
    }, [provider]);

    return {
        data,
        isAdmin: data && adminAddresses[web3.utils.keccak256(data)],
        mutate,
        ...rest
    };
};

export default handlerUseAccount;
