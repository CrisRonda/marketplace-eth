import { createCourseHash } from '@utils/hash';
import { normalizeOwnedCourses } from '@utils/normalize';
import useSWR from 'swr';

const handleuseOwnedCourse = (web3, contract) => (course, account) => {
    const swrRes = useSWR(
        () =>
            web3 && contract && account ? `web3/ownedCourse/${account}` : null,
        async () => {
            const courseHash = createCourseHash(web3)({
                courseId: course.id,
                account
            });

            const ownedCourse = await contract.methods
                .getCourseByHash(courseHash)
                .call();
            if (
                ownedCourse.owner ===
                '0x0000000000000000000000000000000000000000'
            ) {
                return null;
            }

            return normalizeOwnedCourses(web3)(course, ownedCourse);
        }
    );

    return swrRes;
};

export default handleuseOwnedCourse;
