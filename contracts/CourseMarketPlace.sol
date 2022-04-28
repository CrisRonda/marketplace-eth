// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketPlace {
    enum State {
        PURCHASED,
        ACTIVATED,
        DEACTIVATED
    }
    struct Course {
        uint id; // 32 Bytes
        uint price; // 32 Bytes
        bytes32 proof; // 32 Bytes
        address owner; // 20 Bytes
        State state; // 1 Byte
    }

// mapping of courseHast to Course data
    mapping(bytes32 => Course) private ownedCourses;

// mapping of courseId to course hash 
    mapping(uint => bytes32) private ownedCourseHash;

// numer of all courses + id of the course
    uint private totalOwnedCourses;

// owner the contract (as admin)
    address payable private owner;

    constructor(){
        setContractOwner(msg.sender);
    }


    modifier onlyOwner()
    {
        if(msg.sender != getContractOwner()){
            revert OnlyOwner();
        }
        _;
    }

// errors
    /// This course has already a Owner!
    error CourseHasOwner();

    /// Only owner has access!
    error OnlyOwner();


//  course id - 10 --> this is the course ID
// 0x00000000000000000000000000003130 -> this is the course ID in hex
// 0x0000000000000000000000000000313000000000000000000000000000003130 --> fake proof
// 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 --> this is an user account (for this example is from remix)
// 000000000000000000000000000031305B38Da6a701c568545dCfcB03FcB875f56beddC4 -> [courseId_HEX][USER_ACCOUNT]
// keccak256 c4eaa3558504e2baa2669001b43f359b8418b44a4477ff417b4b007d7cc86e37 -> [courseId_HEX][USER_ACCOUNT] hashed in keccak256
       //--> c4eaa3558504e2baa2669001b43f359b8418b44a4477ff417b4b007d7cc86e37  --> The contract generate the same hash
    function purchaseCourse(bytes16 courseId, bytes32 proof)
    external payable returns(bytes32)
    {
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
        if(hasCourseOwnership(courseHash)){
            revert CourseHasOwner();
        }
        uint id = totalOwnedCourses++;
        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({
            id: id,
            owner: msg.sender,
            price: msg.value,
            proof: proof,
            state: State.PURCHASED
        });
        return courseHash;
    }

    function transferOwnership(address newOwner)
     external
     onlyOwner
    {
        setContractOwner(newOwner);
    }

    function getCourseCount()
    external
    view
    returns (uint)
    {
        return totalOwnedCourses;
    }

    function getCourseHashAtIndex(uint index)
    external
    view
    returns (bytes32)
    {
        return ownedCourseHash[index];
    }
    function getCourseByHash(bytes32 couseHash)
    external
    view
    returns (Course memory)
    {
        return ownedCourses[couseHash];
    }

    function getContractOwner()
    public
    view
    returns (address)
    {
        return owner;
    }

    function setContractOwner(address newOwner) 
     private
    {
        owner = payable(newOwner);

    }

    function hasCourseOwnership(bytes32 courseHash)
    private
    view
    returns (bool)
    {
        return ownedCourses[courseHash].owner == msg.sender;
    }



}