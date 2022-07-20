import { createCourseHash } from '@utils/hash';
import { normalizeOwnedCourses } from '@utils/normalize';
import useSWR from 'swr';

const handleuseOwnedCourses = (web3, contract) => (courses, account) => {
    const swrRes = useSWR(
        () =>
            web3 && contract && account ? `web3/ownedCourses/${account}` : null,
        async () => {
            const ownedCourses = [];

            for (let i = 0; i < courses.length; i++) {
                const course = courses[i];

                if (!course.id) {
                    continue;
                }

                const courseHash = createCourseHash(web3)({
                    courseId: course.id,
                    account
                });

                const ownedCourse = await contract.methods
                    .getCourseByHash(courseHash)
                    .call();
                if (
                    ownedCourse.owner !==
                    '0x0000000000000000000000000000000000000000'
                ) {
                    const normalizeCourse = normalizeOwnedCourses(web3)(
                        course,
                        ownedCourse
                    );
                    ownedCourses.push(normalizeCourse);
                }
            }

            return ownedCourses;
        }
    );

    return {
        ...swrRes,
        lookup:
            swrRes?.data?.reduce?.((acum, curr) => {
                acum[curr.id] = curr;
                return acum;
            }, {}) ?? {}
    };
};

export default handleuseOwnedCourses;
