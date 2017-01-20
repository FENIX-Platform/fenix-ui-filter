/*global define*/

define(function () {

    'use strict';

    return {

        parentsector_code: {

            selector: {
                id: "dropdown",
                default: ["600"],
                config: { //Selectize configuration
                    //maxItems: 1,
                    placeholder: "Please select",
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
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

                id: "dropdown",

                config: {
                    //maxItems: 1,
                    placeholder: "All",
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            cl: {
                codes: ["60010", "60020", "60030", "60040", "60061", "60062", "60063"],
                "uid": "crs_dac",
                "version": "2016",
                "level": 2,
                "levels": 2
            },
            template: {
                hideSwitch: true,
                hideRemoveButton: true
            },
            dependencies: {
                "parentsector_code": {
                    id: "parent",
                    event: "select",
                    //args: {body: {uid: "dani"}}
                }, //obj or array of obj
            }
        },
        "from": {

            "selector": {
                "id": "dropdown",
                //"source" : [ {"value" : "myvalue", "label" : "my custom label"} ], // Static data
                "from": 2000,
                "to": 2014,
                "config": { //Selectize configuration
                    "maxItems": 1
                }
            },

            "format": {
                "output": "time",
                //"process": '{"year": { "time":[{"from": "{{year-from}}", "to": "{{year-to}}" } ]}}'
            },

            "template": {
                title : "From",
                "hideSwitch": true
            }
        },

        "to": {

            "selector": {
                "id": "dropdown",
                "from": 2000,
                "to": 2014,
                "default": [2014],
                "config": { //Selectize configuration
                    "maxItems": 1
                }
            },

            "format": {
                "output": "time"
                //, "process": '{"year": { "time":[{"from": "{{year-from}}", "to": "{{year-to}}" } ]}}' //Not used
            },

            "dependencies": {
                "from": {id: "min", event: "select"}
            },

            "template": {
                title : "to",

                "hideSwitch": true
            }

        }
    }

});