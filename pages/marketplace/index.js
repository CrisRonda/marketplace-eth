import { useState } from 'react';

import { List, Card as CourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';
import { useWalletInfo } from '@components/hooks/web3';
import { Button } from '@components/ui/common';
import { OrderModal } from '@components/ui/order';
import { Header } from '@components/ui/marketplace';
import { useWeb3 } from '@components/providers';

export default function Marketplace({ courses }) {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { canPurchaseCourse, account } = useWalletInfo();
    const { web3, contract } = useWeb3();

    const purchaseCourse = async (order) => {
        // Get hex from course id
        const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);

        // join the hexCourseId with user's address [
        // hexCourseId][userAddress]
        // this join has 32 bytes
        const orderHash = web3.utils.soliditySha3(
            {
                type: 'bytes16',
                value: hexCourseId
            },
            {
                type: 'address',
                value: account.data
            }
        );

        // Get hash from user's email
        const emailHash = web3.utils.soliditySha3(order.email);

        // join the emailHash [emailHash][orderHash]
        // this join has 64 bytes
        const proof = web3.utils.soliditySha3(
            {
                type: 'bytes32',
                value: emailHash
            },
            {
                type: 'bytes32',
                value: orderHash
            }
        );
        const price = web3.utils.toWei(String(order.price));

        try {
            const result = await contract.methods
                .purchaseCourse(hexCourseId, proof)
                .send({ from: account.data, value: price });
        } catch (error) {
            console.log(error);
        }
    };

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
                    onSubmit={purchaseCourse}
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
