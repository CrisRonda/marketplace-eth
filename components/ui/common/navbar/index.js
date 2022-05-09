import { useWeb3 } from '@components/providers';
import { useAccount } from '@components/hooks/web3';

import Button from '../button';
import { useRouter } from 'next/router';
import ActiveLink from '../link';

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
    const { connect, isLoading, requiredInstall } = useWeb3();
    const { account } = useAccount();
    const { pathname } = useRouter();
    const isMarketplace = pathname.includes('/marketplace');

    return (
        <section>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav className="relative" aria-label="Global">
                    <div className="flex flex-col xs:flex-row md:justify-between">
                        <div>
                            {routes.map((item) => (
                                <ActiveLink key={item.href} href={item.href}>
                                    <a
                                        href="/course"
                                        className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                                    >
                                        {item.label}
                                    </a>
                                </ActiveLink>
                            ))}
                        </div>
                        <div>
                            {isLoading ? (
                                <Button disabled>Loading ... </Button>
                            ) : account?.data ? (
                                <Button
                                    variant="green"
                                    className="cursor-default"
                                >
                                    Hello{account.isAdmin && ' Admin'}!
                                </Button>
                            ) : requiredInstall ? (
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
                            ) : (
                                <Button onClick={connect}>
                                    Connect Wallet
                                </Button>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
            {account?.data && !isMarketplace && (
                <div className="flex justify-end sm:px-6 lg:px-8 mt-2">
                    <div className="text-white bg-green-600 p-2 rounded-md">
                        {account.data}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Navbar;
