const handlerUseAccount = (web3) => () => {
    return {
        account: web3 ? 'Test account' : 'No web3'
    };
};

export default handlerUseAccount;
