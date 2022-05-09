const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (name, web3) => {
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();
    let contract = null;

    try {
        contract = new web3.eth.Contract(
            Artifact.abi,
            Artifact.networks[NETWORK_ID].address
        );
    } catch {
        console.log(`Contract ${name} cannot be loaded`);
    }

    return contract;
};

// Load contract with package but it takes a lot of time to load
// and a lot time to build
// import contract from '@truffle/contract';

// export const loadContract = async (name, provider) => {
//     const res = await fetch(`/contracts/${name}.json`);
//     const Artifact = await res.json();
//     const _contract = contract(Artifact);
//     _contract.setProvider(provider);

//     let deployedContract = null;

//     try {
//         deployedContract = await _contract.deployed();
//     } catch (error) {
//         console.log(`Contract ${name} cannot be loaded`);
//     }
//     return deployedContract;
// };
