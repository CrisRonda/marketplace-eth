import createUseAccount from './useAccount';
import createuseNetwork from './useNetwork';
import createUseOwnedCourses from './useOwnedCourses';
import createUseOwnedCourse from './useOwnedCourse';
import createuseManageCourses from './useManagedCourses';

export const setupHooks = ({ web3, provider, contract }) => {
    return {
        useAccount: createUseAccount(web3, provider),
        useNetwork: createuseNetwork(web3),
        useOwnedCourses: createUseOwnedCourses(web3, contract),
        useOwnedCourse: createUseOwnedCourse(web3, contract),
        useManagedCourses: createuseManageCourses(web3, contract)
    };
};
