import { useState } from 'react';

import { List, Card as CourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';
import { useOwnedCourses, useWalletInfo } from '@components/hooks/web3';
import { Button, Loader, Message } from '@components/ui/common';
import { OrderModal } from '@components/ui/order';
import { Header } from '@components/ui/marketplace';
import { useWeb3 } from '@components/providers';

export default function Marketplace({ courses }) {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { hasConnectedWallet, account, isConnecting, network } =
        useWalletInfo();
    const { web3, contract, requiredInstall } = useWeb3();
    const { ownedCourses } = useOwnedCourses(
        courses,
        account.data,
        network.data
    );

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
                {(course) => {
                    const owned = ownedCourses.lookup[course.id];
                    return (
                        <CourseCard
                            key={course.id}
                            {...course}
                            state={owned?.state}
                            disabled={!hasConnectedWallet}
                            Footer={() => {
                                if (requiredInstall) {
                                    return (
                                        <Button
                                            onClick={() =>
                                                setSelectedCourse(course)
                                            }
                                            variant="purple"
                                            disabled={!hasConnectedWallet}
                                        >
                                            Install
                                        </Button>
                                    );
                                }
                                if (isConnecting) {
                                    return (
                                        <Button
                                            onClick={() =>
                                                setSelectedCourse(course)
                                            }
                                            variant="purple"
                                            disabled={!hasConnectedWallet}
                                        >
                                            <Loader />
                                        </Button>
                                    );
                                }
                                if (!ownedCourses.hasInitialResponse) {
                                    return (
                                        <div
                                            style={{
                                                height: 50
                                            }}
                                        />
                                    );
                                }
                                if (owned) {
                                    return (
                                        <>
                                            <div>
                                                <Button
                                                    onClick={() =>
                                                        setSelectedCourse(
                                                            course
                                                        )
                                                    }
                                                    variant="white"
                                                    disabled={true}
                                                >
                                                    Owned
                                                </Button>
                                                {owned.state ===
                                                    'deactivated' && (
                                                    <Button
                                                        variant="purple"
                                                        onClick={() =>
                                                            alert(
                                                                'Reactivating'
                                                            )
                                                        }
                                                        disabled={false}
                                                    >
                                                        Fund to Activate
                                                    </Button>
                                                )}
                                            </div>
                                        </>
                                    );
                                }
                                return (
                                    <Button
                                        onClick={() =>
                                            setSelectedCourse(course)
                                        }
                                        variant="green"
                                        disabled={!hasConnectedWallet}
                                    >
                                        Purchase
                                    </Button>
                                );
                            }}
                        />
                    );
                }}
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
