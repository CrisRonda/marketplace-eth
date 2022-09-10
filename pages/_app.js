import { ToastContainer } from 'react-toastify';
import '@styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

const Noop = ({ children }) => <>{children}</>;
function MyApp({ Component, pageProps }) {
    const Layout = Component.Layout ?? Noop;
    return (
        <Layout>
            <Component {...pageProps} />
            <ToastContainer />
        </Layout>
    );
}

export default MyApp;
