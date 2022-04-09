const Button = ({
    onClick,
    children,
    className = 'text-indigo-600 hover:text-indigo-500',
    ...rest
}) => {
    return (
        <button
            onClick={onClick}
            className={`font-medium mr-8 ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
            {...rest}
        >
            {children}
        </button>
    );
};
export default Button;
