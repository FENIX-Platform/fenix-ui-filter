/*global define */

define([
    'jquery',
    'fx-filter/filtercontroller'
], function ($, FC) {

    var o = {};

    function Start(options) {
        $.extend(true, o, options);
    }

    Start.prototype.init = function (options) {

        $.extend(true, o, options);

        this.controller = new FC({
            //mainContent: document.querySelector(o.container),
            mainContent: o.container,
            prefix_plugin_dir: o.plugin_prefix,
            component_plugin_dir: o.component_plugin_dir || undefined,
            current_layout: o.layout
        });

        this.controller.render();
    };

    Start.prototype.getValues = function (components) {
        return this.controller.getValues(components);
    };

    Start.prototype.getAllValues = function (components) {
        return this.controller.getAllValues(components);
    };

    Start.prototype.add = function (modules, adapterMap) {
        console.log('start-add')
        this.controller.add(modules, adapterMap);
    };

    return Start;
});
