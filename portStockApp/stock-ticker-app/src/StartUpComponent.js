import React from 'react';
import './startUp.css';
import { useState, useEffect } from 'react';

export default function StartUpComponent() {
    //X81QLNGBH0YS89Z1
    const [topGainers, setTopGainers] = useState([]);
    const [topLosers, setTopLosers] = useState([]);
    const [topTradersState, setTopTraders] = useState([]);

    let tradeDataArray = [];
    let refinedDataArray = [];

    async function fetchTraders() {
        let tradersUrl = `
			https://www.alphavantage.co/query?
			function=TOP_GAINERS_LOSERS&
			apikey=X81QLNGBH0YS89Z1;`;
        let response = await fetch(tradersUrl);
        let tradersData = await response.json();
        //console.log(tradersData);

        let topGainersData = tradersData.top_gainers;
        console.log('what is top ' + topGainersData);
        let topLosersData = tradersData.top_losers;

        let mostActiveTraders = tradersData.most_actively_traded;

        // tradeDataArray.push(topGainers, topLosers, mostActiveTraders);

        // tradeDataArray.forEach((ta) => {
        //     let anotherTry = ta.map(a => {
        // /**/ return {
        //             ticker: a.ticker,
        //             price: a.price,
        //             change: a.change_percentage
        //         }
        //     });
        //     refinedDataArray.push(anotherTry.splice(0, 10));
        //     console.log(anotherTry);
        //     return refinedDataArray;
        // });
        //let gainersArray = Object.entries(topGainersData);
        //console.log('checking if turned into array ' + JSON.stringify(gainersArray));

        let collatedData = topGainersData.map((gainers, i) => (
            <div key={i} className='gains'>

                <div>Ticker: {gainers.ticker}</div>
                <div>Price: {gainers.price}</div>
                <div>Percentage Gained: {gainers.change_percentage}</div>
            </div>
        ));

        let collatedLosers = topLosersData.map((losers, i) => (
            <div key={i} className='loss'>

                <div>Ticker: {losers.ticker}</div>
                <div>Price: {losers.price}</div>
                <div>Percentage Gained: {losers.change_percentage}</div>
            </div>
        ));

        let collatedActiveTraders = mostActiveTraders.map((traders, i) => (

            <div key={i} className='mostTraded'>
                <div>Ticker: {traders.ticker}</div>
                <div>Price: {traders.price}</div>
                <div>Percentage Gained: {traders.change_percentage}</div>
            </div>

        ));
        console.log('test mostTraded' + JSON.stringify(mostActiveTraders))

        setTopTraders(collatedActiveTraders);
        setTopGainers(collatedData.splice(0, 10));
        setTopLosers(collatedLosers);
    }

    useEffect(() => {
        fetchTraders();
    }, []);
    return (
        <>
            <h1 className='titles'>Stocks with the greatest gains</h1>
            <div className='tradingInfo gains'>{topGainers}</div>
            <hr></hr>
            <h1 className='titles'>Stocks with the greatest Losses</h1>
            <div className='tradingInfo losses'>{topLosers}</div>
            <hr></hr>
            <h1 className='titles'>Most Traded Stocks</h1>
            <div className='tradingInfo mostTraded'>{topTradersState}</div>
        </>
    )
}