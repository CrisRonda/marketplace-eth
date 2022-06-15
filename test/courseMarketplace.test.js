const { catchRevert } = require('./utils/exceptions');

const CourseMarketplace = artifacts.require('CourseMarketplace');

// Mocha - testing framework
// Chai - assertion JS library

const getBalance = async (account) => {
    const balance = await web3.eth.getBalance(account);
    return balance;
};

const toBN = (value) => {
    return web3.utils.toBN(value);
};

const getGas = async (result) => {
    const tx = await web3.eth.getTransaction(result.tx);
    const gasUsed = toBN(result.receipt.gasUsed);
    const gastPrice = toBN(tx.gasPrice);
    const gasCost = gastPrice.mul(gasUsed);
    return gasCost;
};
contract('CourseMarketplace', (accounts) => {
    let _contract = null;
    let contractOwner = null;
    let buyer = null;
    let courseHash = null;

    const courseId = '0x00000000000000000000000000003130';
    const proof =
        '0x0000000000000000000000000000313000000000000000000000000000003130';
    const courseId2 = '0x00000000000000000000000000002130';
    const proof2 =
        '0x0000000000000000000000000000213000000000000000000000000000002130';
    const value = '900000000';

    before(async () => {
        _contract = await CourseMarketplace.deployed();
        buyer = accounts[1];
        contractOwner = accounts[0];
    });

    describe('Purchase the new course', () => {
        before(async () => {
            await _contract.purchaseCourse(courseId, proof, {
                from: buyer,
                value
            });
        });

        it('should NOT allow to repurchase already owned course', async () => {
            await catchRevert(
                _contract.purchaseCourse(courseId, proof, {
                    from: buyer,
                    value
                })
            );
        });
        it('can get the purchased course hash by index', async () => {
            const index = 0;
            courseHash = await _contract.getCourseHashAtIndex(index);
            const expectedHash = web3.utils.soliditySha3(
                { type: 'bytes16', value: courseId },
                { type: 'address', value: buyer }
            );

            assert.equal(
                courseHash,
                expectedHash,
                'Course hash is not maching the hash of purchased course!'
            );
        });

        it('should match the data of the course purchased by buyer', async () => {
            const expectedIndex = 0;
            const expectedState = 0;
            const course = await _contract.getCourseByHash(courseHash);

            assert.equal(course.id, expectedIndex, 'Course index should be 0!');
            assert.equal(
                course.price,
                value,
                `Course price should be ${value}!`
            );
            assert.equal(
                course.proof,
                proof,
                `Course proof should be ${proof}!`
            );
            assert.equal(
                course.owner,
                buyer,
                `Course buyer should be ${buyer}!`
            );
            assert.equal(
                course.state,
                expectedState,
                `Course state should be ${expectedState}!`
            );
        });
    });

    describe('Activate the purchased course', () => {
        it('shouldn not be able to activate course by NOT contract owner', async () => {
            catchRevert(
                _contract.activateCourse(courseHash, {
                    from: buyer
                })
            );
        });
        it("should have 'activated' state", async () => {
            await _contract.activateCourse(courseHash, { from: contractOwner });
            const course = await _contract.getCourseByHash(courseHash);
            const exptectedState = 1;

            assert.equal(
                course.state,
                exptectedState,
                "Course should have 'activated' state"
            );
        });
    });

    describe('Transfer ownership', () => {
        let currentOwner = null;
        before(async () => {
            currentOwner = await _contract.getContractOwner();
        });

        it('getContractOwner should return deployer address', async () => {
            assert.equal(
                contractOwner,
                currentOwner,
                'Contract owner should be deployer!'
            );
        });

        it('should NOT transfer ownership when the contract owner is not sending TX', async () => {
            await catchRevert(
                _contract.transferOwnership(accounts[3], {
                    from: accounts[4]
                })
            );
        });
        it('should transfer ownership to 3rd address from accounts[]', async () => {
            await _contract.transferOwnership(accounts[2], {
                from: currentOwner
            });
            const owner = await _contract.getContractOwner();
            assert.equal(
                owner,
                accounts[2],
                'Contract owner is not the second account'
            );
        });
        it('should transfer ownership back to initial contract owner', async () => {
            await _contract.transferOwnership(currentOwner, {
                from: accounts[2]
            });
            const owner = await _contract.getContractOwner();
            assert.equal(
                owner,
                currentOwner,
                'Contract owner is not the second account'
            );
        });
    });

    describe('Deactivate course', () => {
        let courseHash2 = null;
        before(async () => {
            await _contract.purchaseCourse(courseId2, proof2, {
                from: buyer,
                value
            });
            courseHash2 = await _contract.getCourseHashAtIndex(1);
        });

        it('should NOT be able to deactivate course by NOT contract owner', async () => {
            await catchRevert(
                _contract.deactivateCourse(courseHash2, { from: buyer })
            );
        });
        it('should have status of deactivated and price 0', async () => {
            await _contract.deactivateCourse(courseHash2, {
                from: contractOwner
            });
            const course = await _contract.getCourseByHash(courseHash2);
            const expectedState = 2;
            const expectedPrice = 0;

            assert.equal(
                course.state,
                expectedState,
                'Course is NOT deactivated!'
            );
            assert.equal(course.state, expectedState, 'Course price is not 0!');
        });
        it('should NOT be able to activate deactivate course', async () => {
            await catchRevert(
                _contract.activateCourse(courseHash2, { from: contractOwner })
            );
        });
    });

    describe('Repurchase course', () => {
        let courseHash2 = null;
        before(async () => {
            courseHash2 = await _contract.getCourseHashAtIndex(1);
        });
        it("should NOT repurchase when the course doesn't exist", async () => {
            const notExistingHash = '0x00000000000000000000000000008888';
            await catchRevert(
                _contract.repurchaseCourse(notExistingHash, {
                    from: buyer
                })
            );
        });

        it('should NOT repurchase with NOT course owner', async () => {
            const notOwnerAddres = accounts[2];
            await catchRevert(
                _contract.repurchaseCourse(courseHash2, {
                    from: notOwnerAddres
                })
            );
        });

        it('should be able repurchase with the original buyer', async () => {
            const beforeTxBuyerBalance = await getBalance(buyer);

            const result = await _contract.repurchaseCourse(courseHash2, {
                from: buyer,
                value
            });
            const afterTxBuyerBalance = await getBalance(buyer);

            // START - Calculating the gas used in this tx
            const gasCost = await getGas(result);
            //  END - Calculating the gas used in this tx

            const course = await _contract.getCourseByHash(courseHash2);
            const expectedState = 0;
            assert.equal(
                course.state,
                expectedState,
                'Course state is not purchased state!'
            );
            assert.equal(
                course.price,
                value,
                `Course state is not equal to ${value}!`
            );
            assert.equal(
                toBN(beforeTxBuyerBalance)
                    .sub(toBN(value))
                    .sub(gasCost)
                    .toString(),
                afterTxBuyerBalance,
                'Buyer balance is not correct!'
            );
        });

        it('should NOT be able to repurchase deactivate course', async () => {
            await catchRevert(
                _contract.repurchaseCourse(courseHash2, {
                    from: buyer
                })
            );
        });
    });
});

// Owner value
// 99.5917

// Buyer value
// 99.8936 - 99.8786
