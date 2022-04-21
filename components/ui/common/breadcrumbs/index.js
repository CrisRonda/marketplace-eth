import ActiveLink from '../link';

const Breadcrumbs = ({ items }) => {
    return (
        <nav aria-label="breadcrumb">
            <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
                {items?.map((item, index) => (
                    <li
                        key={item.href}
                        className={` ${
                            index === 0 ? 'pr-4' : 'px-4 '
                        }  font-medium text-gray-500 hover:text-gray-900`}
                    >
                        <ActiveLink
                            href={item.href}
                            activeLinkClass=" text-red-900"
                        >
                            <a className="text-lg">{item.value}</a>
                        </ActiveLink>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
