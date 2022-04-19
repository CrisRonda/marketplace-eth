import { useState } from 'react';

import { WalletBar } from '@components/ui/web3';
import { List, Card as CourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';
import { useAccount, useNetwork } from '@components/hooks/web3';
import { Button } from '@components/ui/common';
import { OrderModal } from '@components/ui/order';

export default function Marketplace({ courses }) {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { account } = useAccount();
    const { network } = useNetwork();

    return (
        <>
            <div className="py-5">
                <WalletBar address={account.data} network={network} />
            </div>
            <List courses={courses}>
                {(course) => (
                    <CourseCard
                        key={course.id}
                        {...course}
                        Footer={() => (
                            <div className="mt-4">
                                <Button
                                    onClick={() => setSelectedCourse(course)}
                                    variant="green"
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
