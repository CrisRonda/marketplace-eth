import {
    createContext,
    useContext,
    useCallback,
    useEffect,
    useState,
    useMemo
} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { setupHooks } from './hooks/setupHooks';
import { loadContract } from '@utils/loadContract';

const Web3Context = createContext();

const createWeb3State = ({ web3, provider, contract, isLoading }) => {
    return {
        contract,
        provider,
        isLoading,
        web3,
        hooks: setupHooks({
            web3,
            provider,
            contract
        })
    };
};

const Web3Provider = ({ children }) => {
    const [web3Api, setWeb3Api] = useState(
        createWeb3State({
            web3: null,
            provider: null,
            contract: null,
            isLoading: false
        })
    );

    const loadProvider = useCallback(async () => {
        try {
            const provider = await detectEthereumProvider();
            if (!provider) {
                throw new Error('No provider found');
            }
            const web3 = new Web3(provider);
            const contract = await loadContract('CourseMarketPlace', web3);
            setWeb3Api(
                createWeb3State({
                    provider,
                    web3,
                    contract,
                    isLoading: false
                })
            );
        } catch (error) {
            setWeb3Api((bef) => ({ ...bef, error }));
        } finally {
            setWeb3Api((bef) => ({ ...bef, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        loadProvider();
    }, [loadProvider]);
    const errorMessage = useCallback(
        () => alert('Please install MetaMask to use this app'),
        []
    );

    const connect = useCallback(async () => {
        try {
            await web3Api.provider.request({
                method: 'eth_requestAccounts'
            });
        } catch (error) {
            location.reload();
        }
    }, [web3Api.provider]);

    const _web3Api = useMemo(() => {
        const { web3, provider, isLoading } = web3Api;
        return {
            ...web3Api,
            connect: () => (provider ? connect() : errorMessage()),
            hooks: setupHooks({ web3 }),
            requiredInstall: !isLoading && !web3
        };
    }, [connect, errorMessage, web3Api]);

    return (
        <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
    );
};

export default Web3Provider;

export const useWeb3 = () => {
    return useContext(Web3Context);
};

export const useHooks = (cb) => {
    const { hooks } = useWeb3();
    return cb(hooks);
};
