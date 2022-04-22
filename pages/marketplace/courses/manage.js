import { CourseFilter, OwnedCourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { Header } from '@components/ui/marketplace';

const Manage = () => {
    return (
        <div>
            <Header />
            <CourseFilter />
            <section className="grid grid-cols-1">
                <OwnedCourseCard />
            </section>
        </div>
    );
};

export default Manage;
Manage.Layout = BaseLayout;
