const SIZE = {
    sm: 'p-2 text-sm xs:px-4',
    md: 'p-3 text-base xs:px-8',
    lg: 'p-4 text-lg xs:px-10'
};
const Button = ({
    onClick,
    children,
    variant = 'purple',
    className,
    size = 'md',
    ...rest
}) => {
    const variants = {
        white: 'text-black bg-white border-2',
        purple: 'text-white bg-indigo-600 hover:text-indigo-500',
        red: 'text-white bg-red-600 hover:text-red-500',
        green: 'text-white bg-green-600 hover:text-green-500',
        orange: 'text-white bg-orange-200 hover:text-orange-200'
    };
    const sizeClass = SIZE[size];
    return (
        <button
            onClick={onClick}
            className={`${sizeClass} font-medium mr-8 ${className} ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed rounded-lg`}
            {...rest}
        >
            {children}
        </button>
    );
};
export default Button;
