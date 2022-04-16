import { WalletBar } from '@components/ui/web3';
import { List } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';
import { useAccount } from '@components/hooks/web3/useAccount';
import { useNetwork } from '@components/hooks/web3/useNetwork';

export default function Marketplace({ courses }) {
    const { account } = useAccount();
    const { network } = useNetwork();

    return (
        <>
            <div className="py-5">
                <WalletBar address={account.data} network={network.data} />
            </div>
            <List courses={courses} />
        </>
    );
}

export const getStaticProps = () => {
    const { data } = getAllCourse();
    return { props: { courses: data } };
};

Marketplace.Layout = BaseLayout;
