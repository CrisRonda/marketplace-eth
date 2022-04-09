import Link from 'next/link';
const routes = [
    {
        href: '/',
        label: 'Home'
    },
    {
        href: '/marketplace',
        label: 'Marketplace'
    },
    {
        href: '/blogs',
        label: 'Blogs'
    },
    {
        href: '/wishlist',
        label: 'Wishlist'
    }
];
const Navbar = () => {
    return (
        <section>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav className="relative" aria-label="Global">
                    <div className="flex justify-between">
                        <div>
                            {routes.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <a
                                        href="/course"
                                        className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                                    >
                                        {item.label}
                                    </a>
                                </Link>
                            ))}
                        </div>
                        <div>
                            <a
                                href="#"
                                className="font-medium mr-8 text-indigo-600 hover:text-indigo-500"
                            >
                                Connect Wallet
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
};

export default Navbar;
