import './header.css';
import './body.css';
import { useState } from 'react';
import Plot from 'react-plotly.js';
import StartUpComponent from './StartUpComponent';

//'dd527eb6c694477d883345ced748da46'
//old API key 0XKCNP6X86C6VES1
//new API key X81QLNGBH0YS89Z1
//Her API key 4I2545ZFCAUBUXU2

function App() {
  const [stockState, setStockState] = useState([]);
  const [symbol, setSymbol] = useState('IBM');
  const [info, setInfo] = useState({});
  const [xValues, setXValues] = useState([]);
  const [yValues, setYValues] = useState([]);

  const [errorState, setErrorState] = useState(null);

  function buildOverviewURL() {
    return `
			https://www.alphavantage.co/query?
			function=OVERVIEW&
			symbol=${symbol === '' ? 'IBM' : symbol}&
			apikey=0XKCNP6X86C6VES1;
		`;
  }




  async function fetchOverview() {
    let url = buildOverviewURL();

    let response = await fetch(url)
      .then(res => { return res.json() })
      .then(data => { return data })
      .catch(err => { throw (err) });

    console.log(`Overview data:`);
    console.log(response);

    let infoEntries = Object.entries(response).filter(property => {
      console.log('what is property[0]' + property[0]);
      return property[0] === 'Description' ||
        property[0] === 'Name';
    });

    let infoObj = Object.fromEntries(infoEntries);
    setInfo(infoObj);
  }

  // useEffect(() => {
  //   fetchTraders();
  // }, []);
  // //fetchTraders()
  async function getStockData() {
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=X81QLNGBH0YS89Z1`);
      const stocksData = await response.json();
      if (stocksData['Time Series (Daily)']) {

        console.log('am I getting all the data?', stocksData['Time Series (Daily)']);

        //This would have worked if I pushed it into an array
        /*for (let key in stocksData['Time Series (Daily)']) {
          let myYvalues = stocksData['Time Series (Daily)'][key]['1. open'];
          setYValues(myYvalues);
        }*/

        let allData = Object.entries(stocksData['Time Series (Daily)']) || {};
        let xValueArray = [];
        let yValueArray = [];

        allData.forEach(data => {
          xValueArray.push(data[0]);
          yValueArray.push(data[1]['1. open']);
        });

        setXValues(xValueArray);
        setYValues(yValueArray);

        let dailyData = Object.entries(stocksData['Time Series (Daily)'])[0] || {};
        console.log('is this todays date? line 65', dailyData);
        let yesterdayData = Object.entries(stocksData['Time Series (Daily)'])[1] || {};

        console.log('yesterdays data or error', yesterdayData);
        setStockState(dailyData);
        console.log('getting data', dailyData);
        console.log('getting full data', stocksData);

        let root = [5, 3, 2];
        if (root[0] === root[1] + root[2]) {
          console.log(true)
        } else {
          console.log(false);
        }
      }
    }
    catch (e) {
      console.log('Houston we have a problem!', e);
    }
    fetchOverview();
  }


  function handleClick() {
    getStockData();
  }

  function updateSymbol(e) {
    setSymbol(e.target.value);
    console.log(e.target.value);
  }
  //because stockState is the daily stock
  let anyStockData = stockState[1] !== undefined ? stockState[1]['1. open'] : '';

  let xValueData = xValues !== undefined ? xValues : 'Past 100 Days of Data';
  let yValueData = yValues !== undefined ? yValues : 'Past 100 Opening Prices';


  return (
    <>{/*error && <div className="error">{error}</div>*/}
      <h2 className="header">Henry's Stock App</h2>
      <div className="tickerInput">

        <hr></hr>
        <label>Enter ticker symbol here: </label>
        {<input className="input" onInput={(e) => updateSymbol(e)} placeholder={'Please enter a valid symbol'} /> || <p>{/*updateSymbol('TSLA')*/}</p>}
        <button onClick={handleClick}>search</button>
      </div>

      {!anyStockData ? <StartUpComponent /> :
        <section className="stockInfoSection">
          <div>
            <h2>{info.Name !== undefined ? info.Name : ''}</h2>
            {info.Description !== undefined ? info.Description : ''}
          </div>
          <h2 className='stockPrice'>{'$' + anyStockData}</h2>
          {anyStockData && <Plot
            data={[
              {
                x: xValueData,
                y: yValueData,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'red' },
              }
            ]}
            layout={{ width: 820, height: 440, title: info.Name !== undefined ? info.Name + ' Past 100 Days' : '' }}
          />}
        </section>}
    </>
  );
}

export default App;


