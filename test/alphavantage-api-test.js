describe("Alpha search", () => {
    beforeEach(() => {
        fixture.setBase("test");
        fixture.load("search.fixture.html");
        window.AlphaSearchController.init();
    });

    afterEach(() => {
        fixture.cleanup();
    });

    it("should start with an empty search field", () => {
        expect($("#search-term").val()).toBe("");
    });

    it("should start with a disabled search button", () => {
        expect($("#graph-button").prop("disabled")).toBe(true);
    });

    describe("search button", () => {
        var searchTerm;
        var searchButton;

        beforeEach(() => {
            searchTerm = $("#search-term");
            searchButton = $("#graph-button");
        });

        it("should be enabled when the search field is not blank", () => {
            searchTerm.val("i can haz unit tests").trigger("input");
            expect(searchButton.prop("disabled")).toBe(false);
        });

        it("should be disabled when the search field is blank", () => {
            searchTerm.val("").trigger("input");
            expect(searchButton.prop("disabled")).toBe(true);
        });
    });

    describe("API calls - Stock Graphs", () => {
        var request;
        beforeEach(() => {
            jasmine.Ajax.install();

            $("#search-term").val("fb");
            $("input[name='radio-group']:checked").val();
            $('#FormControlSelect :selected').val();
            $("#graph-button").click();
            request = jasmine.Ajax.requests.mostRecent();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it("should trigger a Stock/Crypto search when the search button is clicked", () => {
            expect(request.url).toBe(`https://www.alphavantage.co/query?outputsize=compact
&apikey=ZJF5RAKQ4SUSZMR4&function=TIME_SERIES_DAILY
&symbol=fb`);
        });

        it("should populate the graph container when search results arrive", () => {
            expect($("#graph").children().length).toBe(0);
            request.respondWith({
                status: 200,
                responseText: JSON.stringify({
                    "Meta Data": {},
                    "Time Series (Daily)": {
                        "2017-11-03": {
                            "1. open": "179.2900",
                            "2. high": "179.8600",
                            "3. low": "176.7100",
                            "4. close": "178.9200",
                            "5. volume": "15270375"
                        },
                        "2017-11-02": {
                            "1. open": "179.2900",
                            "2. high": "179.8600",
                            "3. low": "176.7100",
                            "4. close": "178.9200",
                            "5. volume": "15270375"
                        }
                    }
                })
            });
            expect($("#graph").children().length).toBe(1);
        });
    });

    describe("API calls - Currency Exhange Rate", () => {
        var request;

        beforeEach(() => {
            jasmine.Ajax.install();
            $('#currency_drop1 :selected').val();
            $('#currency_drop2 :selected').val();
            $("#currency_amount").val();
            $("#currency-button").click();
            $("#currency-spot").val();
            window.AlphaSearchController.init();

            request = jasmine.Ajax.requests.mostRecent();
        });

        it("should trigger a Currency exchange search when the Convert button is clicked", () => {
            expect(request.url).toBe(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE
&from_currency=USD&to_currency=EUR&apikey=ZJF5RAKQ4SUSZMR4`);
        });

        it("should populate the container under the search the with an currency alert", () => {
            expect($("#currency-spot").children().length).toBe(0);
            request.respondWith({
                status: 200,
                responseText: JSON.stringify({
                    "Realtime Currency Exchange Rate": {
                        "1. From_Currency Code": "USD",
                        "2. From_Currency Name": "United States Dollar",
                        "3. To_Currency Code": "EUR",
                        "4. To_Currency Name": "Euro",
                        "5. Exchange Rate": "0.86151200",
                        "6. Last Refreshed": "2017-11-04 01:48:02",
                        "7. Time Zone": "UTC"
                    }
                })
            });
            expect($("#currency-spot").children().length).toBe(1);
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });
    });
});
