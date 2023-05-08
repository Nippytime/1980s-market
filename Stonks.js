const stocks = [];

let isDataFetched = false;

function sendStockData() {
  fetch('historical.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(stocks)
  })
}

function fetchStockData() {
  if (isDataFetched) {
    return;
  }
  isDataFetched = true;

  fetch('get_prices.php')
    .then(response => response.json())
    .then(data => {
      data.forEach(stock => {
        const price = parseFloat(stock.price);
        if (!isNaN(price)) {
          stocks.push({
            ticker: stock.ticker,
            price: price,
            priceHistory: [price],
            recoverTimer: 0
          });
        }
      });

      initialize();
    });
}

fetchStockData();

function randomCrashTimer() {
  const week = 6 * 24 * 7;
  const twoMonths = 6 * 24 * 30 * 2;
  return week + Math.floor(Math.random() * (twoMonths - week));
}

function weightedRandom() {
  const lambda = 7;
  return -Math.log(1 - Math.random()) / lambda;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function updatePrices() {
  for (let stock of stocks) {
    const meanReversionRate = 0.01;
    const momentumRate = 0.01;
    const randomEventRate = 0.01;

    const meanReversionFactor = meanReversionRate * (stock.originalPrice - stock.price);
    const priceChange = stock.price - stock.priceHistory.slice(-1)[0];
    const momentumFactor = momentumRate * priceChange;
    const mu = 0.002 * stock.price;
    const sigma = 0.002 + (0.008 * weightedRandom());
    const dt = 1 / (6 * 24 * 360);
    const epsilon = weightedRandom() * 2 - 1;
    const drift = mu * dt;
    const volatility = sigma * Math.sqrt(dt) * epsilon;
    const randomEventFactor = randomEventRate * getRandomArbitrary(-1, 1) * stock.price;

    stock.price += meanReversionFactor + momentumFactor + drift + volatility + randomEventFactor;

    if (stock.price < 0) {
      stock.price = 0;
    }

    stock.priceHistory.push(stock.price);
  }
}

function updateTable() {
  const tbody = document.getElementById('stocksTbody');
  tbody.innerHTML = '';

  for (let stock of stocks) {
    const tr = document.createElement('tr');
    const tickerTd = document.createElement('td');
    const priceTd = document.createElement('td');
    const tickerLink = document.createElement('a'); // Create an anchor element for the link

    tickerLink.href = `chart.html?ticker=${stock.ticker}`; // Set the href attribute with the ticker symbol as a query parameter
    tickerLink.textContent = stock.ticker; // Set the text content of the link to the ticker symbol
    tickerLink.classList.add("ticker-link");

    tickerTd.appendChild(tickerLink); // Append the link to the ticker cell
    priceTd.textContent = '$' + stock.price.toFixed(2);

    tr.appendChild(tickerTd);
    tr.appendChild(priceTd);
    tbody.appendChild(tr);
  }
}

function initialize() {
  for (let stock of stocks) {
    stock.nextCrash = randomCrashTimer();
    stock.originalPrice = stock.price;
  }

  updatePrices();
  updateTable();

    // Update prices and table every 10 seconds
    setInterval(() => {
        updatePrices();
        updateTable();
    }, 10 * 1000);

    // Send data to the server every 30 seconds
    setInterval(() => {
        sendStockData();
    }, 30 * 1000);
}

function adjustFontSize() {
  const table = document.getElementById("responsiveTable");
  const tableRows = table.getElementsByTagName("tr");
  const maxHeight = window.innerHeight * 0.8 * 0.8; // 80% of content height (80% of window height)
  const minHeight = 16; // Minimum font size in pixels

  for (let fontSize = 40; fontSize >= minHeight; fontSize--) {
    let totalHeight = 0;
    table.style.fontSize = `${fontSize}px`;

    for (let i = 0; i < tableRows.length; i++) {
      totalHeight += tableRows[i].offsetHeight;
    }

    if (totalHeight <= maxHeight) {
      break;
    }
  }
}

const table = document.getElementById("responsiveTable");
if (table) {
  adjustFontSize();
}

window.addEventListener("resize", adjustFontSize);
document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("responsiveTable");
  if (table) {
    adjustFontSize();
  }
});
