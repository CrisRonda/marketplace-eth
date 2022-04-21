import { Breadcrumbs } from '@components/ui/common';
import { EthRates, WalletBar } from '@components/ui/web3';

const LINKS = [
    {
        href: '/marketplace',
        value: 'Buy'
    },
    {
        href: '/marketplace/courses/owned',
        value: 'My Courses'
    },
    {
        href: '/marketplace/courses/manage',
        value: 'Manage Courses'
    }
];

const Header = () => {
    return (
        <div className="py-5">
            <WalletBar />
            <EthRates />
            <div className="flex flex-row-reverse py-4 px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={LINKS} />
            </div>
        </div>
    );
};
export default Header;
