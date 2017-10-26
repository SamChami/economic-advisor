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
                    let resultString = JSON.stringify(results);
                    var data = [
                      {
                        x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
                        y: [1, 3, 6],
                        type: 'scatter'
                      }
                    ];

                    Plotly.newPlot('graph', data);
//VERY VERY BROKEN. Trying to Append/Add Plotly to the container graph
                    resultGraph.empty().append(
                    )
                    //  Plotly.newPlot('graph', data);
                })
            });
            searchTerm.bind("input", () => searchButton.prop("disabled", !searchTerm.val()));
        }
    };
})();
