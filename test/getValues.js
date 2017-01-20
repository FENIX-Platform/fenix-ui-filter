/*global describe, it*/
var Filter = require("../src/js/index"),
    $ = require("jquery"),
    singleSelector = require("./models/singleSelector"),
    singleGroup = require("./models/singleGroup"),
    filter;

describe("Single Selector", function () {

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

    it("valid", function (done) {

        var values;

        filter = new Filter({
            el: "#filter",
            selectors: singleSelector
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.valid).to.be.true;

            done(); //async execution
        });


    });

    it("'values' is object", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.values).to.be.an('object');

            done(); //async execution
        });


    });

    it("'values.item' value", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.values.item).to.be.an('array');

            done(); //async execution
        });
    });

    it("'labels' is object", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.labels).to.be.an('object');

            done(); //async execution
        });


    });

    it("'labels.item' is an object", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.labels.item).to.be.an('object');

            done(); //async execution
        });
    });

    it("'labels.item' contains selection label", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            var labels = values.labels.item;

            expect(labels['item_1']).to.be.an('string');
            expect(labels['item_1']).to.be.equal('Item 1');

            done(); //async execution
        });
    });

});

/*
describe("Single Group", function () {

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

    it("valid", function (done) {

        var values;

        filter = new Filter({
            el: "#filter",
            selectors: singleGroup
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.valid).to.be.true;

            done(); //async execution
        });
    });

    it("'values' is object", function (done) {

        var values,
            selectors = $.extend({}, singleGroup);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.values).to.be.an('object');

            done(); //async execution
        });


    });

    it("'values.item' is an object", function (done) {

        var values,
            selectors = $.extend({}, singleGroup);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.values.item).to.be.an('object');

            done(); //async execution
        });
    });

    it("'values.item' contains 'fist' and 'second' selectors' values", function (done) {

        var values,
            selectors = $.extend({}, singleGroup);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.values.item).to.be.an('object');
            expect(values.values.item).to.have.property('first');
            expect(values.values.item).to.have.property('second');
            expect(values.values.item.first).to.be.an('array');
            expect(values.values.item.second).to.be.an('array');

            done(); //async execution
        });
    });

    it("'labels' is object", function (done) {

        var values,
            selectors = $.extend({}, singleGroup);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.labels).to.be.an('object');

            done(); //async execution
        });


    });

    it("'labels.item' is an object", function (done) {

        var values,
            selectors = $.extend({}, singleGroup);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.labels.item).to.be.an('object');

            done(); //async execution
        });
    });

    it("'labels.item' contains 'first' and 'second' selectors' labels", function (done) {

        var values,
            selectors = $.extend({}, singleGroup);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            values = filter.getValues();

            expect(values.labels.item.first).to.be.an('object');
            expect(values.labels.item.second).to.be.an('object');

            done(); //async execution
        });
    });

});
*/
