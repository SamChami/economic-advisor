"use strict";

(() => {
    window.AlphaSearchController = {
        init: () => {
            let Plotly = window.Plotly;
            let searchButton = $("#graph-button");
            let searchTerm = $("#search-term");
            let resultGraph = $("#graph");
            let currencyButton = $("#currency-button");
            let currencyHolder = $("#currency-spot");
            let clearButton = $("#clear-button");
            let newsSpace = $("#news-space");
            let url = 'https://newsapi.org/v2/top-headlines?' +
                  'sources=bbc-news&' +
                  'apiKey=06eefc5cf15f43ca8311e178202c8cd1';

            $.getJSON(url).done(results => {

                for (let i = 0; i < results['totalResults']; i++) {
                    newsSpace.append(`<div
                    class="col-md-6 newsHeadline"
                    style="background-image:url(${results['articles'][i]['urlToImage']});>
                    ${results['articles'][i]['title']}
                    </div>`);
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
                  '<div>' + currencyVal + " " + results['Realtime Currency Exchange Rate']['2. From_Currency Name'] +
                  " is equal to " + currencyVal * results['Realtime Currency Exchange Rate']['5. Exchange Rate'] +
                  ' ' + results['Realtime Currency Exchange Rate']['4. To_Currency Name'] +
                  '</div>').addClass('alert alert-info text-center')
                );
            });

            $(".risk-this").risk({
                change: function (color, risk) {
                    $("#riskStatus").empty().append(risk).addClass('alert alert-danger text-center');
                }
            });

            clearButton.click(() => {
                currencyHolder.empty().removeClass();
            });

            searchTerm.bind("input", () => searchButton.prop("disabled", !searchTerm.val()));
        }
    };
})();
