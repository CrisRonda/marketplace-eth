const Footer = () => {
    return (
        <footer className="bg-gray-900 pt-1">
            <div className="container mx-auto px-6">
                <div className="mt-5 flex flex-col items-center">
                    <div className="py-6">
                        <p className="mb-1 text-white text-sm text-primary-2 font-bold">
                            © {new Date().getFullYear()}{' '}
                            <a
                                href="https://www.linkedin.com/in/cristian-ronda-169414180/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Cristian Ronda
                            </a>{' '}
                            <br />
                            From{' '}
                            <b>
                                <a
                                    href="https://www.udemy.com/course/solidity-ethereum-in-react-next-js-the-complete-guide/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Solidity & Ethereum in React (Next JS): The
                                    Complete Guide
                                </a>
                            </b>{' '}
                            Udemy Course
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
