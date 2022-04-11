import { useState, useEffect, useCallback } from 'react';

const handlerUseAccount = (web3, provider) => () => {
    const [account, setAccount] = useState(null);
    console.log(web3, provider);
    useEffect(() => {
        const getAccount = async () => {
            try {
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            } catch (error) {
                console.log(error);
            }
        };
        web3 && getAccount();
    }, [web3]);

    useEffect(() => {
        provider &&
            provider?.on('accountsChanged', (accounts) => {
                setAccount(accounts[0]);
            });
    }, [provider]);

    return {
        account
    };
};

export default handlerUseAccount;
