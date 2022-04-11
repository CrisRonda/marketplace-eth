import { useWeb3 } from '@components/providers';
import { useAccount } from '@components/web3/hooks/useAccount';
import Link from 'next/link';
import Button from '../button';

const routes = [
    {
        href: '/',
        label: 'Home'
    },
    {
        href: '/marketplace',
        label: 'Marketplace'
    },
    {
        href: '/blogs',
        label: 'Blogs'
    },
    {
        href: '/wishlist',
        label: 'Wishlist'
    }
];
const Navbar = () => {
    const { connect, isLoading, isWeb3Loaded } = useWeb3();
    const { account } = useAccount();

    return (
        <section>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav className="relative" aria-label="Global">
                    <div className="flex justify-between">
                        <div>
                            {routes.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <a
                                        href="/course"
                                        className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                                    >
                                        {item.label}
                                    </a>
                                </Link>
                            ))}
                        </div>
                        <div>
                            {isLoading ? (
                                <Button disabled>Loading ... </Button>
                            ) : isWeb3Loaded ? (
                                account ? (
                                    <Button
                                        variant="green"
                                        className="cursor-default"
                                    >
                                        Hello!
                                    </Button>
                                ) : (
                                    <Button onClick={connect}>
                                        Connect Wallet
                                    </Button>
                                )
                            ) : (
                                <Button
                                    onClick={() =>
                                        window.open(
                                            'https://metamask.io/download/',
                                            '_blank'
                                        )
                                    }
                                >
                                    Install Metamask
                                </Button>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
            {account && (
                <div className="flex justify-end sm:px-6 lg:px-8 mt-2">
                    <div className="text-white bg-green-600 p-2 rounded-md">
                        {account}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Navbar;
