import Image from 'next/image';
import Link from 'next/link';
import { AnimateKeyframes } from 'react-simple-animate';

const Card = ({
    title,
    id,
    coverImage,
    type,
    description,
    slug,
    Footer,
    disabled,
    state
}) => {
    return (
        <div
            key={id}
            className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
        >
            <div className="md:flex">
                <div className="flex-1 h-full next-image-wrapper">
                    <Image
                        priority
                        width="200"
                        height="230"
                        layout="responsive"
                        className={`object-cover ${
                            disabled && 'filter grayscale'
                        }`}
                        src={coverImage}
                        alt={title}
                    />
                </div>
                <div className="p-8  pb-4 flex-2">
                    <div className="flex items-center">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold ">
                            {type}
                        </div>

                        <div>
                            {state === 'activated' && (
                                <div className="text-xs rounded-full p-2 ml-2 bg-green-400">
                                    Activated
                                </div>
                            )}
                            {state === 'deactivated' && (
                                <div className="text-xs rounded-full p-2 ml-2 bg-red-600">
                                    Deactivated
                                </div>
                            )}
                            {state === 'purchased' && (
                                <AnimateKeyframes
                                    play
                                    duration={1.5}
                                    iterationCount="infinite"
                                    easeType="ease"
                                    direction="alternate"
                                    keyframes={['opacity: .3', 'opacity: 1']}
                                >
                                    <div className="text-xs rounded-full p-2 ml-2 bg-yellow-400">
                                        Waiting for activation
                                    </div>
                                </AnimateKeyframes>
                            )}
                        </div>
                    </div>
                    <Link href={`/course/${slug}`}>
                        <a className="block mt-1 text-sm xs:text-lg leading-tight font-medium text-black hover:underline">
                            {title}
                        </a>
                    </Link>
                    <p className="mt-2 text-gray-500">
                        {description?.substring(0, 70)}...
                    </p>
                    {Footer && (
                        <div className="mt-2">
                            <Footer />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;
