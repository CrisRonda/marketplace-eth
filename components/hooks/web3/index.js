import { useEffect } from 'react';

import { useHooks } from '@components/providers/web3';
import { useRouter } from 'next/router';
import { useWeb3 } from '@components/providers';

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
export const useAdmin = ({ redirectTo }) => {
    const { account } = useAccount();
    const { requireInstall } = useWeb3();
    const router = useRouter();
    useEffect(() => {
        if (
            requireInstall ||
            (account.hasInitialResponse && !account.isAdmin) ||
            account.isEmpty
        ) {
            router.push(redirectTo);
        }
    }, [
        account.hasInitialResponse,
        account.isAdmin,
        account.isEmpty,
        redirectTo,
        requireInstall,
        router
    ]);

    return {
        account
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
export const useManageCourses = (...args) => {
    const res = enhanceHook(
        useHooks((hooks) => hooks.useManagedCourses)(...args)
    );
    return {
        managedCourses: res
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
    const isConnecting =
        !account.hasInitialResponse && !network.hasInitialResponse;
    return {
        account,
        network,
        hasConnectedWallet: !!(account?.data && network?.isSupported),
        isConnecting
    };
};
