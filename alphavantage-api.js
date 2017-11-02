"use strict";

(() => {
    window.AlphaSearchController = {
        init: () => {
            let searchButton = $("#graph-button");
            let searchTerm = $("#search-term");
            let resultGraph = $("#graph");
            let currencyButton = $("#currency-button");
            let currencyHolder = $("#currency-spot");
            let url;
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
                        resultGraph.empty();
                        Plotly.newPlot('graph', data);
                        // This is not defined because Plotly.js is not loaded from HTML yet.
                    } else {
                        resultGraph.empty().append("Error! Please Enter a Correct Ticker.");
                    }
                });
            });
            currencyButton.click(() => {
                const currencyVal = $("#currency_amount").val() > 0 ? $("#currency_amount").val() : 1;
                const dropdown1 = $('#currency_drop1 :selected');
                const dropdown2 = $('#currency_drop2 :selected');
                url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE
&from_currency=${dropdown1.val()}&to_currency=${dropdown2.val()}&apikey=ZJF5RAKQ4SUSZMR4`;
                $.getJSON(url).done(results => currencyHolder.empty().append(
                    currencyVal + " " + results['Realtime Currency Exchange Rate']['2. From_Currency Name'] +
                    " is equal to " + currencyVal * results['Realtime Currency Exchange Rate']['5. Exchange Rate'] +
                    ' ' + results['Realtime Currency Exchange Rate']['4. To_Currency Name']
                ));
            });

            searchTerm.bind("input", () => searchButton.prop("disabled", !searchTerm.val()));
        }
    };
})();
