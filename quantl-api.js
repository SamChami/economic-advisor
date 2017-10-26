"use strict";

(() => {
    window.QuantlStockSearch = {
        init: () => {
            let searchButton = $("#search-button");
            let searchParam = $("#radio-buttons radio:checked" + "DAILY");
            let searchTerm = $("#search-term");
            let resultGraph = $(".graph")
            let url;
            // API Keys: ZJF5RAKQ4SUSZMR4
            searchButton.click(() => {
                url = `https://www.alphavantage.co/query?outputsize=compact&apikey=ZJF5RAKQ4SUSZMR4&function=
                ${searchParam.val()}&symbol=${searchTerm.val()}`;
                $.getJSON(url).done(results => {
                    results
                    var data = {
                        type: "scatter",
                        mode: "lines",
                        name: searchTerm.val(),
                        x: unpack(rows, 'Date'),
                        y: unpack(rows, 'AAPL.High'),
                        line: {color: '#17BECF'}
                    };

//VERY VERY BROKEN
                    resultGraph.empty().append(
                      Plotly.newPlot('graph', data);
                });
            });
            searchTerm.bind("input", () => searchButton.prop("disabled", !searchTerm.val()));
        }
    };
})();
