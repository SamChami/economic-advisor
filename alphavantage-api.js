"use strict";

(() => {
    window.AlphaSearchController = {
        init: () => {
            let searchButton = $("#graph-button");
            let searchTerm = $("#search-term");
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
                    Plotly.newPlot('graph', data);
                });
            });
            currencyButton.click(() => {
                const dropdown1 = $('#currency_drop1 :selected');
                const dropdown2 = $('#currency_drop2 :selected');
                url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE
&from_currency=${dropdown1.val()}&to_currency=${dropdown2.val()}&apikey=ZJF5RAKQ4SUSZMR4`;
                $.getJSON(url).done(results => currencyHolder.empty().append(
                    "1 " + results['Realtime Currency Exchange Rate']['2. From_Currency Name'] +
                    " is equal to " + results['Realtime Currency Exchange Rate']['5. Exchange Rate'] +
                    ' ' + results['Realtime Currency Exchange Rate']['4. To_Currency Name']
                ));
            });

            searchTerm.bind("input", () => searchButton.prop("disabled", !searchTerm.val()));
        }
    };
})();
