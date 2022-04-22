const SIZES = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
};
const Loader = ({ size = 'md' }) => {
    return (
        <div className={`${SIZES[size]} sk-chase`}>
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={`circle-${index}`} className="sk-chase-dot"></div>
            ))}
        </div>
    );
};

export default Loader;
