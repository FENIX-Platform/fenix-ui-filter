define([
    'loglevel',
    'jquery',
    'underscore',
    '../../../dist/fenix-ui-filter.min',
    'demo/src/models/all'
], function (log, $, _, Filter, AllModel) {

    'use strict';

    var s = {
        ALL: "#all",
        ALL_SUMMARY: "#all-summary"
    };

    function Demo() {
        //trace, debug, info, warn, error, silent
        log.setLevel('trace');

        log.trace("Demo started");

        this._render();
    }

    Demo.prototype._render = function () {

        this._bindEventListeners();

        this._renderAll();
    };

    Demo.prototype._bindEventListeners = function () {

        $("#snippet-btn").on("click", function () {

            _.each(AllModel, function (obj, key) {

                var $snippet = $("<div class='col-xs-6'><code></code></div>");
                $snippet.find("code").html(JSON.stringify(obj));

                if ($("[data-selector='" + key + "']").length > 0) {
                    $("[data-selector='" + key + "']").after($snippet);
                } else {
                    $("[data-semantic='" + key + "']").after($snippet);
                }

            })

        });

    };

    Demo.prototype._renderAll = function () {

        var filter = new Filter({
            selectors: AllModel,
            el: s.ALL,
            summaryEl: s.ALL_SUMMARY
        });

    };

    return new Demo();

});