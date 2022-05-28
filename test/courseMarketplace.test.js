const CourseMarketplace = artifacts.require('CourseMarketplace');

contract('CourseMarketplace', (accounts) => {
    let _contract = null;
    let contractOwner = null;
    let buyer = null;

    const courseId = '0x00000000000000000000000000003130';
    const proof =
        '0x0000000000000000000000000000313000000000000000000000000000003130';
    const value = '9000000';

    before(async () => {
        _contract = await CourseMarketplace.deployed();
        buyer = accounts[0];
        contractOwner = accounts[1];
    });
    describe('Purchase the new coruse', () => {
        before(async () => {
            await _contract.purchaseCourse(courseId, proof, {
                from: buyer,
                value
            });
        });
        it('can get the purchased coursed hash by index', async () => {
            const index = 1;
            const courseHash = await _contract.getCourseHashAtIndex(index);

            const expectedCourseHash = web3.utils.soliditySha3(
                {
                    type: 'bytes16',
                    value: courseId
                },
                {
                    type: 'address',
                    value: buyer
                }
            );
            assert.equal(
                courseHash,
                expectedCourseHash,
                "Course hash doesn't match"
            );
        });
    });
});
