import createUseAccount from './useAccount';
import createuseNetwork from './useNetwork';

export const setupHooks = (...deps) => {
    return {
        useAccount: createUseAccount(...deps),
        useNetwork: createuseNetwork(...deps)
    };
};
