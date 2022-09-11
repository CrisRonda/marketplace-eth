import { ToastContainer } from 'react-toastify';
import '@styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { useEffect } from 'react';

const Noop = ({ children }) => <>{children}</>;
function MyApp({ Component, pageProps }) {
    const Layout = Component.Layout ?? Noop;
    useEffect(() => {
        (function titleScroller(text) {
            document.title = text;
            console.log(text);
            setTimeout(function () {
                titleScroller(text.substring(1) + text.substring(0, 1));
            }, 500);
        })(' 🚀Marketplace Ropsten Course🚀 ');
    }, []);

    return (
        <>
            <Head>
                <title> </title>
            </Head>
            <Layout>
                <Component {...pageProps} />
                <ToastContainer />
            </Layout>
        </>
    );
}

export default MyApp;
