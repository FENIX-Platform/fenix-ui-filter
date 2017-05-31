/*global define*/

define([
        'jquery'
    ],
    function ($) {

        'use strict';

        return {
            parentsector_code: {
                selector: {
                    id: "tree",
                    default: ["311", "9999"],
                    hideSummary: false, //Hide selection summary,
                    sort: true
                },
                cl: {
                    uid: "crs_dac",
                    version: "2016",
                    level: 1,
                    levels: 1
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            purposecode: {
                selector: {
                    id: "tree",
                    hideSummary: false, //Hide selection summary,
                    sort: true
                },
                cl: {
                    // codes: ["60010", "60020", "60030", "60040", "60061", "60062", "60063"],
                    "uid": "crs_dac",
                    "version": "2016",
                    "level": 2,
                    "levels": 2
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                },
                format: {
                    uid: "crs_purposes"
                },
                dependencies: {
                    "parentsector_code": {id: "parent", event: "select"} //obj or array of obj
                }
            }
        }

    });