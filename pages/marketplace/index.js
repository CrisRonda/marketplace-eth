import { useState } from 'react';

import { EthRates, WalletBar } from '@components/ui/web3';
import { List, Card as CourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';
import { useWalletInfo } from '@components/hooks/web3';
import { Button } from '@components/ui/common';
import { OrderModal } from '@components/ui/order';
import { Header } from '@components/ui/marketplace';

export default function Marketplace({ courses }) {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { canPurchaseCourse } = useWalletInfo();

    return (
        <>
            <Header />
            <List courses={courses}>
                {(course) => (
                    <CourseCard
                        key={course.id}
                        {...course}
                        disabled={!canPurchaseCourse}
                        Footer={() => (
                            <div className="mt-4">
                                <Button
                                    onClick={() => setSelectedCourse(course)}
                                    variant="green"
                                    disabled={!canPurchaseCourse}
                                >
                                    Purchase
                                </Button>
                            </div>
                        )}
                    />
                )}
            </List>

            {selectedCourse && (
                <OrderModal
                    course={selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                />
            )}
        </>
    );
}

export const getStaticProps = () => {
    const { data } = getAllCourse();
    return { props: { courses: data } };
};

Marketplace.Layout = BaseLayout;
