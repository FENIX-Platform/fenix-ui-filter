/*global describe, it*/
var Filter = require("../src/js/index"),
    $ = require("jquery"),
    singleSelector = require("./models/singleSelector"),
    filter,
    value = "item_2",
    newValues = {
        values: {
            item: [value]
        }
    };

describe("Selector", function () {

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
            filter.setValues(newValues);

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
            filter.setValues(newValues);

            values = filter.getValues();

            expect(values.values).to.be.an('object');

            done(); //async execution
        });


    });

    it("'values.item' is an array ", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            filter.setValues(newValues);

            values = filter.getValues();

            expect(values.values.item).to.be.an('array');

            done(); //async execution
        });
    });

    it("'values.item' is the updated value", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {

            filter.setValues(newValues);

            values = filter.getValues();

            expect(values.values.item[0]).to.be.equal(value);

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
            filter.setValues(newValues);

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
            filter.setValues(newValues);

            values = filter.getValues();

            console.log(JSON.stringify(values))

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
            filter.setValues(newValues);

            values = filter.getValues();

            expect(values.labels.item[value]).to.be.an('string');
            expect(values.labels.item[value]).to.be.equal('Item 2');

            done(); //async execution
        });
    });
});

/*
describe("Group", function () {

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
            filter.setValues(newValues);

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
            filter.setValues(newValues);

            values = filter.getValues();

            expect(values.values).to.be.an('object');

            done(); //async execution
        });


    });

    it("'values.item' is an array ", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {
            filter.setValues(newValues);

            values = filter.getValues();

            expect(values.values.item).to.be.an('array');

            done(); //async execution
        });
    });

    it("'values.item' is the updated value", function (done) {

        var values,
            selectors = $.extend({}, singleSelector);

        filter = new Filter({
            el: "#filter",
            selectors: selectors
        }).on("ready", function () {

            filter.setValues(newValues);

            values = filter.getValues();

            expect(values.values.item[0]).to.be.equal(value);

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
            filter.setValues(newValues);

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
            filter.setValues(newValues);

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
            filter.setValues(newValues);

            values = filter.getValues();

            expect(values.labels.item[value]).to.be.an('string');
            expect(values.labels.item[value]).to.be.equal('Item 2');

            done(); //async execution
        });
    });
});*/
