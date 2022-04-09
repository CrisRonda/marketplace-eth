import { Web3Provider, useWeb3 } from '@components/providers';
import { Footer, Navbar } from '@components/ui/common';

const BaseLayout = ({ children }) => {
    return (
        <Web3Provider>
            <div className="relative max-w-8xl mx-auto px-4">
                <Navbar />
                <div className="fit">{children}</div>
            </div>
            <Footer />
        </Web3Provider>
    );
};

export default BaseLayout;
