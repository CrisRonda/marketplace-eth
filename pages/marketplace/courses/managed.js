import { useState } from 'react';
import { useAdmin, useManageCourses } from '@components/hooks/web3';
import { Button, Message } from '@components/ui/common';
import { CourseFilter, ManagedCourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { Header } from '@components/ui/marketplace';
import { useWeb3 } from '@components/providers';

const Manage = () => {
    const { account } = useAdmin({ redirectTo: '/marketplace' });
    const { managedCourses } = useManageCourses(account);
    const { web3, contract } = useWeb3();

    if (!account.isAdmin) {
        return null;
    }

    const activateCourse = async (courseHash) => {
        try {
            console.log(1);
            await contract.methods.activateCourse(courseHash).send({
                from: account.data
            });
            console.log(2);
        } catch (error) {
            console.error(error);
            console.log(3);
        }
    };
    const deactivateCourse = async (courseHash) => {
        try {
            console.log(1);
            await contract.methods.deactivateCourse(courseHash).send({
                from: account.data
            });
            console.log(2);
        } catch (error) {
            console.error(error);
            console.log(3);
        }
    };
    return (
        <>
            <Header />
            <CourseFilter />
            <section className="grid grid-cols-1">
                {managedCourses.data?.map((course) => (
                    <VerificationInput
                        key={course.ownedCourseId}
                        course={course}
                        web3={web3}
                        activateCourse={activateCourse}
                        deactivateCourse={deactivateCourse}
                    />
                ))}
            </section>
        </>
    );
};

export default Manage;
Manage.Layout = BaseLayout;
const VerificationInput = ({
    course,
    web3,
    activateCourse,
    deactivateCourse
}) => {
    const [email, setEmail] = useState('');
    const [proofedOwnership, setProofedOwnership] = useState({});

    const vefirfyCourse = (email, { hash, proof }) => {
        const emailHash = web3.utils.sha3(email);
        const proofToCheck = web3.utils.soliditySha3(
            {
                type: 'bytes32',
                value: emailHash
            },
            {
                type: 'bytes32',
                value: hash
            }
        );

        setProofedOwnership({
            [hash]: proofToCheck === proof
        });
    };
    return (
        <ManagedCourseCard key={course.ownedCourseId} course={course}>
            <div className="flex mr-2 relative rounded-md">
                <input
                    value={email}
                    onChange={({ target: { value } }) => setEmail(value)}
                    type="text"
                    name="account"
                    id="account"
                    className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0x2341ab..."
                />
                <Button
                    className="ml-2"
                    onClick={() => {
                        vefirfyCourse(email, {
                            hash: course.hash,
                            proof: course.proof
                        });
                    }}
                >
                    Verify
                </Button>
            </div>
            {proofedOwnership[course.hash] && (
                <div className="mt-2">
                    <Message>Verified!</Message>
                </div>
            )}
            {proofedOwnership[course.hash] === false && (
                <div className="mt-2">
                    <Message type="danger">Wrong Proof!</Message>
                </div>
            )}
            {course.state === 'purchased' && (
                <div className="mt-4">
                    <Button
                        variant="green"
                        onClick={() => activateCourse(course.hash)}
                    >
                        Activate
                    </Button>
                    <Button
                        variant="red"
                        onClick={() => deactivateCourse(course.hash)}
                    >
                        Deactivate
                    </Button>
                </div>
            )}
        </ManagedCourseCard>
    );
};
