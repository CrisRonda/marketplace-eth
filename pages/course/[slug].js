import { useAccount, useOwnedCourse } from '@components/hooks/web3';
import { useWeb3 } from '@components/providers';
import { Message } from '@components/ui/common';
import { Curriculum, Hero, KeyPoints, Modal } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';

export default function CourseBySlug({ course }) {
    const { isLoading } = useWeb3();
    const { account } = useAccount();
    const { ownedCourse } = useOwnedCourse(course, account.data);
    const courseState = ownedCourse.data?.state;
    const isLocked =
        !courseState ||
        courseState === 'purchased' ||
        courseState === 'deactivated';

    return (
        <div className="relative max-w-7xl mx-auto px-4">
            <Hero
                hasOwner={!!ownedCourse.data}
                title={course.title}
                description={course.description}
                imageUrl={course.coverImage}
            />
            <KeyPoints points={course.wsl} />
            <div className="max-w-5xl mx-auto">
                {courseState === 'purchased' && (
                    <Message type="warning">
                        Course is purchased and waiting for the activation.
                        Process can take up to 24 hours.{'\n'}
                        <i className="block font-normal">
                            In case of any question, please contact
                            info@info.com
                        </i>
                    </Message>
                )}
                {courseState === 'activated' && (
                    <Message>
                        Eincode wishes you happy watching of the course.
                    </Message>
                )}
                {courseState === 'deactivated' && (
                    <Message type="danger">
                        Course has been deactivated, due the purchase data. The
                        functionality is not available.
                        {'\n'}
                        <i className="block font-normal">
                            In case of any question, please contact
                            info@info.com
                        </i>
                    </Message>
                )}
            </div>
            <Curriculum
                locked={isLocked}
                courseState={courseState}
                isLoading={isLoading}
            />
            <Modal />
        </div>
    );
}

export const getStaticPaths = () => {
    const { data } = getAllCourse();
    return {
        paths: data.map((c) => ({
            params: {
                slug: c.slug
            }
        })),
        fallback: false
    };
};

export const getStaticProps = async ({ params }) => {
    const { data } = getAllCourse();
    const course = data.find((item) => item.slug === params.slug) || {};
    return {
        props: {
            course
        }
    };
};
CourseBySlug.Layout = BaseLayout;
