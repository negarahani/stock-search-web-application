
console.log("Script loaded successfully");

document.addEventListener("DOMContentLoaded", function() {
    const myBtn = document.getElementById("stockButton");
    const clearBtn = document.getElementById("clearButton");
    const myForm = document.getElementById("stockForm");
    const stockInput = document.getElementById("stockSearch");
    var resultSec = document.getElementById('results');
    var errorSec = document.getElementById("error");
    var stockTicker;

    clearBtn.addEventListener("click", function() {
        // Clear the input field
        stockInput.value = '';
        stockInput.focus();
    });

    myForm.addEventListener("submit", function(e){
        //prevent form submission and page reload >> we need to handle it with JS
        e.preventDefault();

        //is this needed? we are handling with "required" in HTML
        if (stockInput.value == '' || stockInput.value == null){
            return;
        }
     
        stockTicker = stockInput.value;

        //making a fetch request to the Python backend
        //fetch company information
        fetch(`${window.origin}/search-company?ticker=${stockTicker}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (!data || Object.keys(data).length === 0) {
                resultSec.style.display = 'none';
                errorSec.style.display = 'block';
                return;
            } 
            populateCompany(data);
            errorSec.style.display = 'none';
            resultSec.style.display = 'block';
        })
        .catch(error => console.log(error));

        //fetch stock information
        fetch(`${window.origin}/search-stock?ticker=${stockTicker}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (!data || Object.keys(data).length === 0) {
                return;
            } 
            populateStock(data);
        })
        .catch(error => console.log(error));

        //fetch chart information
        fetch(`${window.origin}/search-chart?ticker=${stockTicker}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (!data.results || Object.keys(data.results).length === 0) {
                return;
            } 
            populateChart(data);
        })
        .catch(error => console.log(error));
        
        //fetch recommendations
        fetch(`${window.origin}/search-recom?ticker=${stockTicker}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (!data || Object.keys(data).length === 0) {
                return;
            } 
            populateRecom(data);
        })
        .catch(error => console.log(error));

        //fetch latest news
        fetch(`${window.origin}/search-news?ticker=${stockTicker}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (!data || Object.keys(data).length === 0) {
                errorSec.display = 'block';
                return;
            } 
            populateNews(data);
        })
        .catch(error => console.log(error));

    })

   
    function populateCompany(data){
        const companyLogo = document.getElementById("company-logo");
        const companyName = document.getElementById("company-name");
        const tickerSymbolCompany = document.getElementById("stock-ticker-symbol-company")
        const exchangeCode = document.getElementById("stock-exchange-code");
        const startDate = document.getElementById("company-start-date");
        const category = document.getElementById("category")
        companyLogo.innerHTML = `<img src="${data.logo}" alt="Company Logo">`;
        companyName.textContent = data.name;
        tickerSymbolCompany.textContent = data.ticker;
        exchangeCode.textContent = data.exchange;
        startDate.textContent = data.ipo;
        category.textContent = data.finnhubIndustry;
        
    }

    function populateStock(data){
        //const stockSec = document.getElementById("stock-summary");
        //stockSec.textContent = JSON.stringify(data);

        const tickerSymbolSummary = document.getElementById("stock-ticker-symbol-summary");
        const tradingDay = document.getElementById("trading-day");
        const prevClosingPrice = document.getElementById("previous-closing-price");
        const openingPrice = document.getElementById("opening-price");
        const highPrice = document.getElementById("high-price");
        const lowPrice = document.getElementById("low-price");
        const change = document.getElementById("change");
        const changePercent = document.getElementById("change-percent");
        var dynamicImage1 = document.getElementById("dynamic-image-1");
        var dynamicImage2 = document.getElementById("dynamic-image-2");
        tickerSymbolSummary.textContent = stockTicker;

        const tradingDayFormatted = new Date(data.t * 1000);
        const day = tradingDayFormatted.getDate();
        const monthName = tradingDayFormatted.toLocaleString('default', { month: 'long' });
        const year = tradingDayFormatted.getFullYear();

        tradingDay.textContent = day +' '+ monthName + ', ' + year;

        prevClosingPrice.textContent = data.pc;
        openingPrice.textContent = data.o;
        highPrice.textContent = data.h;
        lowPrice.textContent = data.l;

        change.textContent = data.d;
        if (data.d > 0) {
            dynamicImage1.src = '/img/GreenArrowUp.png';
        } else {
            dynamicImage1.src = '/img/RedArrowDown.png';
        }
        changePercent.textContent = data.dp;
        if (data.dp > 0) {
            dynamicImage2.src = '/img/GreenArrowUp.png';
        } else {
            dynamicImage2.src = '/img/RedArrowDown.png';
        }
    }

    function populateRecom(data){
        const latestRecommendation = data[0];

        const buy = document.getElementById("buy");
        const hold = document.getElementById("hold");
        const sell = document.getElementById("sell");
        const strongBuy = document.getElementById("strong-buy");
        const strongSell = document.getElementById("strong-sell");

        buy.textContent = latestRecommendation.buy;
        hold.textContent = latestRecommendation.hold;
        sell.textContent = latestRecommendation.sell;
        strongBuy.textContent = latestRecommendation.strongBuy;
        strongSell.textContent = latestRecommendation.strongSell;
    }

    function populateChart(data){
        const chartSec = document.getElementById("charts");
        const priceArray = data.results.map(point => ([point.t, point.c]));
        const volumeArray = data.results.map(point => ([point.t, point.v]));
        const toDate = data.to_date_formatted;

        //const minX = Math.min(...priceArray.map(point => point[0]));
        //const maxX = Math.max(...priceArray.map(point => point[0]));

        Highcharts.stockChart('chart-container', {
            title: {
                text:  stockTicker + ' Stock Price ' +  toDate,
            },
            subtitle: {
                text: '<a href="https://polygon.io/" target="_blank">Source: Polygon.io</a>',
                useHTML: true
            },
            yAxis: [{
                opposite: false,
                title: {text: "Stock Price"}
            },{
                opposite: true,
                title: {text: "Volume"}
            }],
            /*xAxis: {
                
                endOnTick: false,
                max: maxX,
            },*/
            rangeSelector: {
                inputEnabled: false,
                buttons: [
                    {
                        type: 'day',
                        count: 7,
                        text: '7d'
                    },
                    {
                        type: 'day',
                        count: 15,
                        text: '15d'
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    },
                    {
                        type: 'month',
                        count: 3,
                        text: '3m'
                    },
                    {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    },
                    
                ],
                selected: 0
            },
    
            navigator: {
                series: {
                    accessibility: {
                        exposeAsGroupOnly: true
                    }
                }
            },
            series: [{
                name: 'Stock Price',
                data: priceArray,
                type: 'area',
                threshold: null,
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                yAxis: 0
            },{
                name: 'Volume',
                data: volumeArray,
                type: 'column',
                yAxis: 1, 
            }
            ],
            plotOptions: {
                series: {
                    pointPlacement: 'on',
                    pointWidth: 5
                },
                column: {
                    color: 'black'
                }
            }
        });
        
    }

    function populateNews(data) {

        const latestNews = document.getElementById("latest-news");
        //we need to clear the previous content before displaying new stuff
        latestNews.innerHTML = "";
        
        var newsCounter = 0;
    
        for (let i = 0; i < data.length && newsCounter < 5; i++){
            const newsData = data[i];
            // Checking if all attributes are present
            if (newsData.image && newsData.headline && newsData.datetime && newsData.url) {
                
                newsCounter++;
                //We create a div for response and then create divs for each key
                const newsRow = document.createElement("div");
                newsRow.classList.add("news-row");
                const newsDiv = document.createElement("div");
                newsDiv.classList.add("news-div");
                const newsTextWrapper = document.createElement("div");
                newsTextWrapper.classList.add("news-text-wrapper");
    
                const newsImage = document.createElement("div");
                /*newsImage.id = "data-news-image"; we have added it in the next line*/ 
                newsImage.innerHTML = `<img src="${newsData.image}" alt="News Image" id="data-news-image">`;
    
                const newsHeadline = document.createElement("div");
                newsHeadline.id = "news-headline";
                newsHeadline.textContent = newsData.headline;         
    
                const newsDatetime = document.createElement("div");
                newsDatetime.id = "news-datetime";
                const mynewsDate = new Date(newsData.datetime * 1000);
                const newsDay = mynewsDate.getDate();
                const newsMonthName = mynewsDate.toLocaleString('default', { month: 'long' });
                const newsYear = mynewsDate.getFullYear();
                newsDatetime.textContent = newsDay +' '+ newsMonthName + ', ' + newsYear;
    
                const newsUrl = document.createElement("div");
                newsUrl.id = "news-url";
                newsUrl.innerHTML = `<a href="${newsData.url}" target="_blank">See Original Post</a>`;
    
                //we need to append each inner div to its parent div


                newsDiv.appendChild(newsImage);

                newsTextWrapper.appendChild(newsHeadline);
                newsTextWrapper.appendChild(newsDatetime);
                newsTextWrapper.appendChild(newsUrl);

                newsDiv.appendChild(newsTextWrapper);

                newsRow.appendChild(newsDiv);
    
                latestNews.appendChild(newsRow);
            }
        
        }
    }
    

    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    
    //get the target for what tab we clicked on >> make all of the tabs disappear >> make only the one we clicked on active
    tabs.forEach(tab => {
        tab.addEventListener('click', ()=>{
            const target = document.querySelector(tab.dataset.tabTarget);
            tabContents.forEach(tabContents => {
                tabContents.classList.remove('active');
            })
            tabs.forEach(tab => {
                tab.classList.remove('active');
            })
            target.classList.add('active');
            tab.classList.add('active');
            
        })
    })
    //to have a default tab content, we set a class "active" for first one

});


