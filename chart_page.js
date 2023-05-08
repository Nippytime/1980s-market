function fetchStockHistory(ticker) {
    return new Promise((resolve, reject) => {
      fetch('get_stock_history.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ticker: ticker })
      })
    });
  }
  
  function createChart(stockHistory) {
  const ctx = document.getElementById('stockChart').getContext('2d');
  const labels = stockHistory.map(entry => entry.timestamp);
  const prices = stockHistory.map(entry => entry.price);

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Price',
        data: prices,
        borderColor: '#00ff00',
        borderWidth: 1,
        pointRadius: 0,
        pointHitRadius: 5
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM D'
            }
          },
          ticks: {
            color: '#00ff00'
          },
          grid: {
            color: '#1a1a1a'
          }
        },
        y: {
          ticks: {
            color: '#00ff00',
            callback: function(value, index, values) {
              return '$' + value.toFixed(2);
            }
          },
          grid: {
            color: '#1a1a1a'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#00ff00'
          }
        }
      },
      maintainAspectRatio: false
    }
  });
}

// Function to get the query parameter value from the URL
function getQueryParamValue(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Get the ticker symbol from the URL's query parameters
  const ticker = getQueryParamValue('ticker');
  
  // Fetch the stock history data for the corresponding stock and create the chart
  fetchStockHistory(ticker)
    .then(response => response.json())
    .then(stockHistory => {
      document.getElementById('stockTitle').innerText = `Historical Chart: ${ticker}`;
      createChart(stockHistory);
    })
    .catch(error => {
      console.error('Error fetching stock history:', error);
    });
  