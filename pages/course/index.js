import { Curriculum, Hero, KeyPoints, Modal } from '@components/course';
import { BaseLayout } from '@components/layout';

export default function Course() {
    return (
        <div className="relative max-w-7xl mx-auto px-4">
            <Hero />
            <KeyPoints />
            <Curriculum />
            <Modal />
        </div>
    );
}
Course.Layout = BaseLayout;
