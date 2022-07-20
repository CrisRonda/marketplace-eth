import { useState } from 'react';
import { useAdmin, useManageCourses } from '@components/hooks/web3';
import { Button, Message } from '@components/ui/common';
import { CourseFilter, ManagedCourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { Header } from '@components/ui/marketplace';
import { useWeb3 } from '@components/providers';
import { normalizeOwnedCourses } from '@utils/normalize';

const Manage = () => {
    const { account } = useAdmin({ redirectTo: '/marketplace' });
    const { managedCourses } = useManageCourses(account);
    const { web3, contract } = useWeb3();
    const [searchedCourse, setSearchedCourse] = useState(null);
    const [filters, setFilters] = useState({
        state: 'all'
    });
    if (!account.isAdmin) {
        return null;
    }
    const changeCourseState = async (courseHash, method) => {
        try {
            await contract.methods[method](courseHash).send({
                from: account.data
            });
        } catch (error) {
            console.error(error);
            console.log(3);
        }
    };
    const activateCourse = async (courseHash) => {
        changeCourseState(courseHash, 'activateCourse');
    };
    const deactivateCourse = async (courseHash) => {
        changeCourseState(courseHash, 'deactivateCourse');
    };

    const searchCourse = async (hash) => {
        const isHex = /[0-9A-Fa-f]{6}/;
        if (hash && hash.length === 66 && isHex.test(hash)) {
            const course = await contract.methods.getCourseByHash(hash).call();
            if (course.owner != '0x0000000000000000000000000000000000000000') {
                const normalized = normalizeOwnedCourses(web3)(
                    { hash },
                    course
                );
                return setSearchedCourse(normalized);
            }
        }
        setSearchedCourse(null);
    };

    const filterCourses = managedCourses.data?.filter((course) => {
        if (filters.state === 'all') {
            return true;
        }
        return course.state === filters.state;
    });

    return (
        <>
            <Header />
            <CourseFilter
                onSearchSubmit={searchCourse}
                onFilterSelected={(value) =>
                    setFilters((bef) => ({ ...bef, state: value }))
                }
            />
            <section className="grid grid-cols-1">
                {searchedCourse && (
                    <div>
                        <h1 className="text-2xl font-bold p-5">Search</h1>
                        <VerificationInput
                            course={searchedCourse}
                            web3={web3}
                            activateCourse={activateCourse}
                            deactivateCourse={deactivateCourse}
                            isSearched
                        />
                    </div>
                )}
                <h1 className="text-2xl font-bold p-5">
                    {filters.state.toUpperCase()} Courses
                </h1>
                {filterCourses?.length ? (
                    filterCourses.map((course) => (
                        <VerificationInput
                            key={course.ownedCourseId}
                            course={course}
                            web3={web3}
                            activateCourse={activateCourse}
                            deactivateCourse={deactivateCourse}
                        />
                    ))
                ) : (
                    <Message type="danger">Not found courses</Message>
                )}
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
    deactivateCourse,
    isSearched = false
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
        <ManagedCourseCard
            key={course.ownedCourseId}
            course={course}
            isSearched={isSearched}
        >
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
