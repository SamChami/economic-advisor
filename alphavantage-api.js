"use strict";

(() => {
    window.AlphaSearchController = {
        init: () => {
            let searchButton = $("#graph-button");
            let searchTerm = $("#search-term");
            let resultGraph = $("#graph");
            let currencyButton = $("#currency-button");
            let url;
            // API Keys: ZJF5RAKQ4SUSZMR4
            searchButton.click(() => {
                let searchParam = $("input[name='radio-group']:checked");
                let searchInterval = $('#FormControlSelect :selected');
                url = `https://www.alphavantage.co/query?outputsize=compact&apikey=ZJF5RAKQ4SUSZMR4${searchParam.val()}${searchInterval.val()}&symbol=${searchTerm.val()}`;
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
                    resultGraph.empty().append(
                    //Show Open and Close Price of Today
                   )
                    Plotly.newPlot('graph', data)
                    // resultGraph.empty().append();
                });
            });
            currencyButton.click(() => {
              let dropdown1 = $('#currency_drop2 :selected');
              let dropdown2 = $('#currency_drop2 :selected');
              url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${dropdown1.val()}&to_currency=${dropdown2.val()}&apikey=ZJF5RAKQ4SUSZMR4`
              $.getJSON(url).done(results => {
//UNFINISHED
              })
            })


            searchTerm.bind("input", () => searchButton.prop("disabled", !searchTerm.val()));
        }
    };
})();
