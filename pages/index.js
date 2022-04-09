import Image from 'next/image';

import { Breadcrumbs, Footer, Hero, Navbar } from '@components/common';
import { EthRates, WalletBar } from '@components/web3';
import { Card } from '@components/order';
import { List } from '@components/course';
import { BaseLayout } from '@components/layout';
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
