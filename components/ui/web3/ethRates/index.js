import Image from 'next/image';

const EthRates = ({ eth, pricePerCourse }) => {
    return (
        <div className="grid grid-cols-2 mb-5 ">
            <div className="flex flex-1 items-stretch text-center">
                <div className="p-10 border drop-shadow rounded-md">
                    <div className="flex items-center">
                        <Image
                            layout="fixed"
                            height={35}
                            width={35}
                            src="/small-eth.webp"
                            alt="Ethereum-logo"
                        />
                        <span className="text-2xl font-bold"> = {eth}$</span>
                    </div>
                    <p className="text-xl text-gray-500">Current eth Price</p>
                </div>
            </div>
            <div className="flex flex-1 items-stretch text-center">
                <div className="p-10 border drop-shadow rounded-md">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">
                            {pricePerCourse}
                        </span>
                        <Image
                            layout="fixed"
                            height={35}
                            width={35}
                            src="/small-eth.webp"
                            alt="Ethereum-logo"
                        />{' '}
                        <span className="text-2xl font-bold">= 15$</span>
                    </div>
                    <p className="text-xl text-gray-500">Price per course</p>
                </div>
            </div>
        </div>
    );
};

export default EthRates;
