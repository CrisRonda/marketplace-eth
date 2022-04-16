import { useHooks } from '@components/providers/web3';

export const useNetwork = () => {
    const ho = useHooks((hooks) => hooks.useNetwork);
    return useHooks((hooks) => hooks.useNetwork)();
};
