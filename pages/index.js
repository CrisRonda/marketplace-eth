import Image from 'next/image';

import { Breadcrumbs, Hero } from '@components/ui/common';
import { EthRates, WalletBar } from '@components/ui/web3';
import { Card } from '@components/ui/order';
import { List, Card as CourseCard } from '@components/ui/course';
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
            <List courses={courses}>
                {(course) => <CourseCard key={course.id} {...course} />}
            </List>
        </>
    );
}

export const getStaticProps = () => {
    const { data } = getAllCourse();
    return { props: { courses: data } };
};

Home.Layout = BaseLayout;
