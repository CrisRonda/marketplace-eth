import createUseAccount from './useAccount';
import createuseNetwork from './useNetwork';
import createUseOwnedCourses from './useOwnedCourses';

export const setupHooks = ({ web3, provider, contract }) => {
    return {
        useAccount: createUseAccount(web3, provider),
        useNetwork: createuseNetwork(web3, provider),
        useOwnedCourses: createUseOwnedCourses(web3, contract)
    };
};
