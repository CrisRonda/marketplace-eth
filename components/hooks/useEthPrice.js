import useSWR from 'swr';
const URL =
    'https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false';
const PRICE_PER_COURSE = 15;
const fetcher = async (url) => {
    const res = await fetch(url);
    const json = await res.json();
    return json.market_data.current_price.usd ?? null;
};

export const useEthPrice = () => {
    const { data, ...rest } = useSWR(URL, fetcher, { refreshInterval: 30000 });

    const pricePerCourse =
        (data && (PRICE_PER_COURSE / Number(data)).toFixed(6)) ?? null;
    return {
        eth: { data, pricePerCourse, ...rest }
    };
};
