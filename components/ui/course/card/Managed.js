const Item = ({ title, value, className }) => {
    return (
        <div className={'bg-white px-4 py-5  sm:px-6 '.concat(className)}>
            <div className="text-sm font-medium text-gray-500">{title}</div>
            <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {value}
            </div>
        </div>
    );
};

export default function ManagedCourseCard({ children, course, isSearched }) {
    isSearched && console.log(isSearched, course);
    return (
        <div
            className={`${
                isSearched ? 'border-indigo-600' : 'bg-gray-200'
            } border shadow overflow-hidden sm:rounded-lg mb-3`}
        >
            <div className="border-t border-gray-200">
                {Object.keys(course).map((key, index) => {
                    return (
                        <Item
                            key={key}
                            title={key[0].toUpperCase() + key.slice(1)}
                            value={course[key]}
                            className={index % 2 !== 0 && 'bg-gray-50'}
                        />
                    );
                })}
                <div className="bg-white px-4 py-5 sm:px-6">{children}</div>
            </div>
        </div>
    );
}
