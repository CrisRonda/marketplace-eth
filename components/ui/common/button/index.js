const Button = ({
    onClick,
    children,
    variant = 'purple',
    className,
    ...rest
}) => {
    const variants = {
        purple: 'text-indigo-600 hover:text-indigo-500',
        red: 'text-red-600 hover:text-red-500',
        green: 'text-green-600 hover:text-green-500'
    };
    return (
        <button
            onClick={onClick}
            className={`font-medium mr-8 ${className} ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
            {...rest}
        >
            {children}
        </button>
    );
};
export default Button;
