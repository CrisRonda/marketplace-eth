import { normalizeOwnedCourses } from '@utils/normalize';
import useSWR from 'swr';

const handleuseManageCourses = (web3, contract) => (account) => {
    const swrRes = useSWR(
        () =>
            web3 && contract && account
                ? `web3/manageCourses/${account}`
                : null,
        async () => {
            const courses = [];
            const courseCount = await contract.methods.getCourseCount().call();
            for (let i = Number(courseCount); i >= 0; i--) {
                const courseHash = await contract.methods
                    .getCourseHashAtIndex(i)
                    .call();
                const course = await contract.methods
                    .getCourseByHash(courseHash)
                    .call();
                if (
                    course &&
                    courseHash !==
                        '0x0000000000000000000000000000000000000000000000000000000000000000'
                ) {
                    courses.push(
                        normalizeOwnedCourses(web3)(
                            { hash: courseHash },
                            course
                        )
                    );
                }
            }
            return courses;
        }
    );

    return swrRes;
};

export default handleuseManageCourses;
