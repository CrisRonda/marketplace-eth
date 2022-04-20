import Image from 'next/image';
import Link from 'next/link';

const Card = ({
    title,
    id,
    coverImage,
    type,
    description,
    slug,
    Footer,
    disabled
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
                    <div className="h-12 uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        {type}
                    </div>
                    <Link href={`/course/${slug}`}>
                        <a className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                            {title}
                        </a>
                    </Link>
                    <p className="mt-2 text-gray-500">
                        {description?.substring(0, 70)}...
                    </p>
                    {Footer && <Footer />}
                </div>
            </div>
        </div>
    );
};

export default Card;
