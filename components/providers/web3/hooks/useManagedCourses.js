import useSWR from 'swr';

const handleuseManageCourses = (web3, contract) => (account) => {
    const swrRes = useSWR(
        () =>
            web3 && contract && account
                ? `web3/manageCourses/${account}`
                : null,
        async () => {
            const courses = [1234, 123, 21];

            return courses;
        }
    );

    return swrRes;
};

export default handleuseManageCourses;
