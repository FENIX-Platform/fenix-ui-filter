define(function () {

    'use strict';

    return {

        validityTimeout: 10000, //10 secs

        corePlugins : ['dropdown', 'tree', 'input', 'range', 'time', 'sortable', 'textarea'],

        languages : ['EN', 'FR', 'ES', 'PR', 'AR', 'CZ'],

        pluginRegistry: { },

        // css class names
        focusedSelectorClassName: "focused", // highlight a selector

        mandatorySelectorClassName: "mandatory", // mandatory selectors
        
        disabledSelectorClassName: "disabled", // disabled selectors

        outputFormat: "plain", // plain || fenix || catalog

        common: {
            template : {
                hideRemoveButton: true,
                hideSwitch: true,
                hideHeaderIcon: true
            }
        },

        direction : "append",
        
        ensureAtLeast : -1,
        
        cache : false,

        lang : "EN"

    }

});