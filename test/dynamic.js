/*global describe, it*/
var Filter = require("../src/js/index"),
    $ = require("jquery"),
    singleSelector = require("./models/singleSelector"),
    singleGroup = require("./models/singleSelector"),
    filter,
    selector = {
        added : {
            selector : {
                id : "dropdown",
                source : [{value : "added_1", label : "Added 1"}],
                default : ["added_1"]
            }
        }
    };

describe("Add", function () {

    // inject the HTML for the tests
    beforeEach(function () {
        var container = '<div id="filter"></div>';
        document.body.insertAdjacentHTML('afterbegin', container);
    });

    // remove the html from the DOM
    afterEach(function () {
        document.body.removeChild(document.getElementById('filter'));
    });

    // remove the html from the DOM
    afterEach(function () {
        filter.dispose();
    });

    it("Valid selector", function (done) {

        var added = false;

        filter = new Filter({
            el: "#filter",
            selectors: singleSelector
        }).on("ready", function () {

            if (!added) {
                added = true;

                filter.add(selector);

            } else {
                var values = filter.getValues();

                console.log(JSON.stringify(values))

                expect(values.valid).to.be.true;
                expect(values.values).to.have.property("added");
                expect(values.values.added).to.be.an("array");
                expect(values.values.added[0]).to.be.equal("added_1");

                done(); //async execution
            }
        });
    });

});

/*describe("Remove", function () {

    // inject the HTML for the tests
    beforeEach(function () {
        var container = '<div id="filter"></div>';
        document.body.insertAdjacentHTML('afterbegin', container);
    });

    // remove the html from the DOM
    afterEach(function () {
        document.body.removeChild(document.getElementById('filter'));
    });

    // remove the html from the DOM
    afterEach(function () {
        filter.dispose();
    });

    it("Valid selector", function (done) {

        filter = new Filter({
            el: "#filter",
            selectors: singleSelector
        }).on("ready", function () {

            filter.remove("item");

            var values = filter.getValues();

            expect(values.valid).to.be.true;
            expect(values.values).to.not.have.property("item");

            done(); //async execution
        });
    });

    it("Valid group", function (done) {

        filter = new Filter({
            el: "#filter",
            selectors: singleGroup
        }).on("ready", function () {

            filter.remove("item");

            var values = filter.getValues();

            expect(values.valid).to.be.true;
            expect(values.values).to.not.have.property("item");

            done(); //async execution
        });
    });

    it("Clear all [single selector]", function (done) {

        filter = new Filter({
            el: "#filter",
            selectors: singleSelector
        }).on("ready", function () {

            filter.clear();

            var values = filter.getValues();

            expect(values.valid).to.be.true;
            expect(values.values).to.be.empty;

            done(); //async execution
        });
    });

    it("Clear all [single group]", function (done) {

        filter = new Filter({
            el: "#filter",
            selectors: singleGroup
        }).on("ready", function () {

            filter.clear();

            var values = filter.getValues();

            expect(values.valid).to.be.true;
            expect(values.values).to.be.empty;

            done(); //async execution
        });
    });


});*/
