import { useState } from 'react';

import { List, Card as CourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';
import { useOwnedCourses, useWalletInfo } from '@components/hooks/web3';
import { Button, Loader } from '@components/ui/common';
import { OrderModal } from '@components/ui/order';
import { Header } from '@components/ui/marketplace';
import { useWeb3 } from '@components/providers';
import { withToast } from '@utils/toast';

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
    const [isNewPurchase, setIsNewPurchase] = useState(true);
    const [busyCourseId, setBusyCourseId] = useState(null);

    const purchaseCourse = async (order, course) => {
        // Get hex from course id
        const hexCourseId = web3.utils.utf8ToHex(course.id);

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

        const price = web3.utils.toWei(String(order.price));
        setBusyCourseId(course.id);
        if (isNewPurchase) {
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
            withToast(_purchaseCourse({ hexCourseId, proof, price }, course));
        } else {
            withToast(
                _repurchaseCourse({ courseHash: orderHash, price }, course)
            );
        }
    };

    const _purchaseCourse = async ({ hexCourseId, proof, price }, course) => {
        try {
            const result = await contract.methods
                .purchaseCourse(hexCourseId, proof)
                .send({ from: account.data, value: price });
            ownedCourses.mutate([
                ...ownedCourses.data,
                {
                    ...course,
                    proof,
                    price,
                    state: 'purchased'
                }
            ]);
            return result;
        } catch (error) {
            throw new Error(error.message);
        } finally {
            setBusyCourseId(null);
        }
    };
    const _repurchaseCourse = async ({ courseHash, price }, course) => {
        try {
            const result = await contract.methods
                .repurchaseCourse(courseHash)
                .send({ from: account.data, value: price });
            const index = ownedCourses.data.findIndex(
                (_course) => _course.id === course.id
            );
            if (index >= 0) {
                ownedCourses.data[index].state = 'purchased';
                ownedCourses.mutate(ownedCourses.data);
            } else {
                ownedCourses.mutate();
            }
            return result;
        } catch (error) {
            throw new Error(error.message);
        } finally {
            setBusyCourseId(null);
        }
    };

    const cleanupModal = () => {
        setSelectedCourse(null);
        setIsNewPurchase(true);
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
                                            size="sm"
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
                                            size="sm"
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
                                        <Button
                                            disabled
                                            size="small"
                                            variant="white"
                                        >
                                            Loading state...
                                        </Button>
                                    );
                                }
                                const isBusyCourse = busyCourseId === course.id;

                                if (owned) {
                                    return (
                                        <>
                                            <div>
                                                <Button
                                                    size="sm"
                                                    variant="white"
                                                    disabled={true}
                                                    className="mr-1"
                                                    onClick={() =>
                                                        alert(
                                                            'You are the owner'
                                                        )
                                                    }
                                                >
                                                    Yours &#10004;
                                                </Button>
                                                {owned.state ===
                                                    'deactivated' && (
                                                    <Button
                                                        size="sm"
                                                        variant={
                                                            isBusyCourse
                                                                ? 'white'
                                                                : 'purple'
                                                        }
                                                        onClick={() => {
                                                            setIsNewPurchase(
                                                                false
                                                            );
                                                            setSelectedCourse(
                                                                course
                                                            );
                                                        }}
                                                        disabled={isBusyCourse}
                                                    >
                                                        {isBusyCourse ? (
                                                            <div className="flex">
                                                                <Loader size="sm" />
                                                                <div className="ml-2">
                                                                    InProgress
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p>
                                                                Fund to Activate
                                                            </p>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </>
                                    );
                                }
                                return (
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            setSelectedCourse(course)
                                        }
                                        variant={
                                            isBusyCourse ? 'white' : 'green'
                                        }
                                        disabled={
                                            !hasConnectedWallet || isBusyCourse
                                        }
                                    >
                                        {isBusyCourse ? (
                                            <div className="flex">
                                                <Loader size="sm" />
                                                <div className="ml-2">
                                                    InProgress
                                                </div>
                                            </div>
                                        ) : (
                                            <p>Purchase</p>
                                        )}
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
                    isNewPurchase={isNewPurchase}
                    onClose={cleanupModal}
                    onSubmit={(formData, course) => {
                        purchaseCourse(formData, course);
                        cleanupModal();
                    }}
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
