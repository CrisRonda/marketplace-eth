import { Button } from '@components/ui/common';
import { CourseFilter, OwnedCourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { Header } from '@components/ui/marketplace';

const Manage = () => {
    return (
        <>
            <Header />
            <CourseFilter />
            <section className="grid grid-cols-1">
                {/* <OwnedCourseCard course={{}}>
                    <div className="flex mr-2 relative rounded-md">
                        <input
                            type="text"
                            name="account"
                            id="account"
                            className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0x2341ab..."
                        />
                        <Button>Verify</Button>
                    </div>
                </OwnedCourseCard> */}
            </section>
        </>
    );
};

export default Manage;
Manage.Layout = BaseLayout;
