"use strict";

(() => {
    window.AlphaSearchController = {
        init: () => {
            let Plotly = window.Plotly;
            let searchButton = $("#graph-button");
            let searchTerm = $("#search-term");
            let resultGraph = $("#graph");
            let infoBox = $("#info-box");
            let currencyButton = $("#currency-button");
            let currencyHolder = $("#currency-spot");
            let clearButton = $("#clear-button");
            let newsSpace = $("#news-space");
            let url = 'https://newsapi.org/v2/top-headlines?' +
                  'sources=bloomberg&' +
                  'apiKey=06eefc5cf15f43ca8311e178202c8cd1';

            $.getJSON(url).done(results => {
                for (let i = 0; i < results['totalResults']; i++) {
                    newsSpace.append(
                    `<a href="${results['articles'][i]['url']}" target="_blank" class="col-sm-5 mx-auto"
                    style="text-decoration:none;
                    margin:1em !important;
                    background:
                      linear-gradient(
                        rgba(0, 0, 0, 0.4),
                        rgba(0, 0, 0, 0.4)
                      ), url(${results['articles'][i]['urlToImage']});
                    height:300px; background-size:cover;
                    " id="box_${i}">
                      <h1 class="">${results['articles'][i]['title']}</h1>
                      <div class="overlay">
                        <p class="text">${results['articles'][i]['description']}</p>
                        </div>
                    </a>`);

                }
            });

            searchButton.click(() => {
                let searchParam = $("input[name='radio-group']:checked");
                let searchInterval = $('#FormControlSelect :selected');
                url = `https://www.alphavantage.co/query?outputsize=compact
&apikey=ZJF5RAKQ4SUSZMR4${searchParam.val()}${searchInterval.val()}
&symbol=${searchTerm.val()}`;

                $.getJSON(url).done(results => {
                    if (results['Error Message'] === undefined) {
                        const objName = Object.keys(results)[1];
                        const propName = searchParam.val() === '&function=TIME_SERIES_' ? '4. close' : '4a. close (USD)';
                        let xValues = Object.keys(results[objName]);
                        let yValues = [];
                        const closingVal = results[objName][xValues[0]][propName];
                        infoBox.empty().append(`<div>Close Price on
                        ${Object.keys(results[objName])[0]}: $${Math.round(100 * closingVal) / 100}</div>
                        <br>
                        <p>Graph data provided by
                        <a href="https://www.alphavantage.co/" target="_blank">Alphavantage.</a></p>
                        `);

                        for (let i in xValues) {
                            yValues.push(results[objName][xValues[i]][propName]);
                        }
                        let data = [
                            {
                                x: xValues,
                                y: yValues,
                                type: 'scatter'
                            }
                        ];
                        let layout = {
                            autosize: true,
                            width: 500,
                            height: 500,
                            margin: {
                                l: 30,
                                r: 0,
                                b: 25,
                                t: 0,
                                pad: 4
                            },
                            paper_bgcolor: '#e8e8e8',
                            plot_bgcolor: '#ffffff'
                        };

                        resultGraph.empty();
                        Plotly.newPlot('graph', data, layout);
                        // This is not defined because Plotly.js is not loaded from HTML yet
                    } else {
                        resultGraph.empty().append("Error! Please Enter a Correct Ticker.");
                    }
                });
            });
            currencyButton.click(() => {
                const currencyVal = $("#currency_amount").val() > 0 ? $("#currency_amount").val() : 1;
                const dropdown1 = $('#currency_drop1 :selected').val();
                const dropdown2 = $('#currency_drop2 :selected').val();
                url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE
&from_currency=${dropdown1}&to_currency=${dropdown2}&apikey=ZJF5RAKQ4SUSZMR4`;
                $.getJSON(url).done(results => currencyHolder.prepend(
                  '<div class="alert alert-info text-center">' + currencyVal + " " +
                  results['Realtime Currency Exchange Rate']['2. From_Currency Name'] +
                  " is equal to " + currencyVal * results['Realtime Currency Exchange Rate']['5. Exchange Rate'] +
                  ' ' + results['Realtime Currency Exchange Rate']['4. To_Currency Name'] +
                  '</div>')
                );
            });

            clearButton.click(() => {
                currencyHolder.empty().removeClass();
            });

            searchTerm.bind("input", () => searchButton.prop("disabled", !searchTerm.val()));
        }
    };
})();
