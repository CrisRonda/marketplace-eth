import { useHooks } from '@components/providers/web3';

const _isEmpty = (data) => {
    return (
        data === null ||
        data === undefined ||
        data === '' ||
        (Array.isArray(data) && data.length === 0) ||
        (Object.keys(data).length === 0 && data.constructor === Object)
    );
};
const enhanceHook = (swrResponse) => {
    const { data, error } = swrResponse;
    const hasInitialResponse = !!(data || error);
    const isEmpty = hasInitialResponse && _isEmpty(data);
    return {
        ...swrResponse,
        isEmpty,
        hasInitialResponse
    };
};

export const useAccount = () => {
    const swrRes = enhanceHook(useHooks((hooks) => hooks.useAccount)());
    return {
        account: swrRes
    };
};

export const useOwnedCourses = (...args) => {
    const res = enhanceHook(
        useHooks((hooks) => hooks.useOwnedCourses)(...args)
    );
    return {
        ownedCourses: res
    };
};
export const useOwnedCourse = (...args) => {
    const res = enhanceHook(useHooks((hooks) => hooks.useOwnedCourse)(...args));
    return {
        ownedCourse: res
    };
};

export const useNetwork = () => {
    const swrRes = enhanceHook(useHooks((hooks) => hooks.useNetwork)());
    return {
        network: swrRes
    };
};

export const useWalletInfo = () => {
    const { account } = useAccount();
    const { network } = useNetwork();

    return {
        account,
        network,
        canPurchaseCourse: !!(account?.data && network?.isSupported)
    };
};
