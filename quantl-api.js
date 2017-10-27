"use strict";

(() => {
    window.AlphaSearchController = {
        init: () => {
            let searchButton = $("#search-button");
            let searchTerm = $("#search-term");
            let resultGraph = $(".graph");
            let url;
            // API Keys: ZJF5RAKQ4SUSZMR4
            searchButton.click(() => {
                let searchParam = $("input[name='radio-group']:checked");
                let searchInterval = $('#FormControlSelect :selected');
                url = `https://www.alphavantage.co/query?outputsize=compact&apikey=ZJF5RAKQ4SUSZMR4${searchParam.val()}${searchInterval.val()}&symbol=${searchTerm.val()}`;
                $.getJSON(url).done(results => {
                    const objName = Object.keys(results)[1];
                    let xValues = Object.keys(results[objName]);
                    let yValues = [];
                    for (let i in xValues) {
                        yValues.push(results[objName][xValues[i]]['1. open']);
                    }
                    let data = [
                        {
                            x: xValues,
                            y: yValues,
                            type: 'scatter'
                        }
                    ];
                    Plotly.newPlot('graph', data)
                    // resultGraph.empty().append();
                });
            });
            searchTerm.bind("input", () => searchButton.prop("disabled", !searchTerm.val()));
        }
    };
})();
