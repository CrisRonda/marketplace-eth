import { useAccount, useOwnedCourses } from '@components/hooks/web3';
import { Button, Message } from '@components/ui/common';
import { OwnedCourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { Header as MarketHeader } from '@components/ui/marketplace';
import { getAllCourse } from '@content/courses/fetcher';
import { useRouter } from 'next/router';
import Link from 'next/link';
export default function OwnedCourses({ courses }) {
    const { account } = useAccount();
    const { ownedCourses } = useOwnedCourses(courses, account.data);
    const router = useRouter();

    return (
        <>
            <div className="py-4">
                <MarketHeader />
            </div>
            <section className="grid grid-cols-1">
                {ownedCourses.hasInitialResponse &&
                    (!ownedCourses.data || !ownedCourses?.data?.length) && (
                        <div className="w-1/2">
                            <Message type="warning">
                                You don&apos;t have any courses yet.
                                <br />
                                <Link href="/marketplace">
                                    <a className="block font-normal hover:underline">
                                        <i>Purchase Course</i>
                                    </a>
                                </Link>
                            </Message>
                        </div>
                    )}

                {ownedCourses.data?.map((course) => (
                    <OwnedCourseCard key={course.id} course={course}>
                        <Button
                            onClick={() =>
                                router.push(`/courses/${course.slug}`)
                            }
                        >
                            Watch the course
                        </Button>
                    </OwnedCourseCard>
                ))}
            </section>
        </>
    );
}

export const getStaticProps = () => {
    const { data } = getAllCourse();
    return { props: { courses: data } };
};

OwnedCourses.Layout = BaseLayout;
