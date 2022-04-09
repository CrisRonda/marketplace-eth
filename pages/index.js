import Image from 'next/image';

import { Breadcrumbs, Footer, Hero, Navbar } from '@components/ui/common';
import { EthRates, WalletBar } from '@components/ui/web3';
import { Card } from '@components/ui/order';
import { List } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';

export default function Home({ courses }) {
    return (
        <>
            <Hero />
            <Breadcrumbs />
            <EthRates />
            <WalletBar />
            <Card />
            <List courses={courses} />
        </>
    );
}

export const getStaticProps = () => {
    const { data } = getAllCourse();
    return { props: { courses: data } };
};

Home.Layout = BaseLayout;
