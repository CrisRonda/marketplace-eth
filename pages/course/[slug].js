import { useAccount, useOwnedCourse } from '@components/hooks/web3';
import { Curriculum, Hero, KeyPoints, Modal } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';

export default function CourseBySlug({ course }) {
    const { account } = useAccount();
    const { ownedCourse } = useOwnedCourse(course, account.data);
    console.log(ownedCourse);
    return (
        <div className="relative max-w-7xl mx-auto px-4">
            <Hero
                title={course.title}
                description={course.description}
                imageUrl={course.coverImage}
            />
            <KeyPoints points={course.wsl} />
            <Curriculum locked />
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
