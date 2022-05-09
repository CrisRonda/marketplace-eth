import { useWalletInfo } from '@components/hooks/web3';
import { useWeb3 } from '@components/providers';
import { Button } from '@components/ui/common';

const WalletBar = () => {
    const { requiredInstall } = useWeb3();
    const { account, network } = useWalletInfo();

    return (
        <section className="text-white bg-indigo-600">
            <div className="p-8">
                <h1 className="text-base xs:text-lg break-words">
                    Hello, {account.data}
                </h1>
                <h2 className="subtitle mb-5 text-base">
                    I hope you are having a great day!
                </h2>
                <div className="flex justify-between items-center">
                    <div className="sm:flex sm:justify-center lg:justify-start">
                        <Button
                            className="rounded-md mr-1 xs:text-lg p-2"
                            variant="white"
                        >
                            Learn how to purchase
                        </Button>
                    </div>
                    <div>
                        {!network?.isSupported && network?.hasInitialResponse && (
                            <div className="bg-red-400 p-4 rounded-lg">
                                <div>Connected to the wrong network</div>
                                <div>
                                    Connected to:{' '}
                                    <strong className="text-2xl">
                                        {network.targetNetwork}
                                    </strong>
                                </div>
                            </div>
                        )}
                        {requiredInstall && (
                            <div className="bg-yellow-500 p-4 rounded-lg">
                                Cannot connect to the Ethereum network. Please
                                install MetaMask.
                            </div>
                        )}
                        {network?.data && (
                            <div>
                                <span>Currently on </span>
                                <strong className="text-2xl">
                                    {network.data}
                                </strong>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WalletBar;
