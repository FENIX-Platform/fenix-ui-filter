/*global describe, it*/
var Filter = require("../src/js/index"),
    $ = require("jquery"),
    singleSelector = require("./models/singleSelector"),
    singleGroup = require("./models/singleGroup"),
    filter;

describe("Selectors", function () {

    // inject the HTML for the tests
    beforeEach(function () {
        var container = '<div id="filter"></div>';
        document.body.insertAdjacentHTML( 'afterbegin', container);
    });

    // remove the html from the DOM
    afterEach(function () {
        document.body.removeChild(document.getElementById('filter'));
    });

    // remove the html from the DOM
    afterEach(function () {
        filter.dispose();
    });

    it("textarea", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        selectors.item.selector.id = "textarea";

        filter = new Filter({
            el: "#filter",
            selectors : selectors
        }).on("ready", function() {
            values = filter.getValues();

            expect(values.values.item[0]).to.be.equal("item_1");

            done(); //async execution
        });
    });

    it("input checkbox", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        selectors.item.selector.id = "input";
        selectors.item.selector.type = "checkbox";

        filter = new Filter({
            el: "#filter",
            selectors : selectors
        }).on("ready", function() {
            values = filter.getValues();

            expect(values.values.item[0]).to.be.equal("item_1");

            done(); //async execution
        });
    });

    it("tree", function (done) {

        var values;

        filter = new Filter({
            el: "#filter",
            selectors : singleSelector
        }).on("ready", function() {
            values = filter.getValues();

            expect(values.values.item[0]).to.be.equal("item_1");

            done(); //async execution
        });
    });

    it("dropdown", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        selectors.item.selector.id = "dropdown";

        filter = new Filter({
            el: "#filter",
            selectors : selectors
        }).on("ready", function() {
            values = filter.getValues();

            expect(values.values.item[0]).to.be.equal("item_1");

            done(); //async execution
        });


    });

});
