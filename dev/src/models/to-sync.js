/*global define*/

define(function () {

    'use strict';

    return {

        "dropdown": {

            "selector": {
                "id": "dropdown",
                "source": [
                    {"value": "enable", "label": "Enable"},
                    {"value": "disable", "label": "Disable"}
                ], // Static data
                "config": { //Selectize configuration
                    //"maxItems": 1
                }
            },

            "format": {
                "type": "static",
                "output": "time",
                //"process": '{"year": { "time":[{"from": "{{year-from}}", "to": "{{year-to}}" } ]}}'
            },

            "template": {
                "hideSwitch": true
            }
        },

        "decimal_separator": {

            "selector": {
                "id": "input",
                "type": "radio",
                "default": ["dot"],
                "source": [
                    {"value": "dot", "label": "Dot"},
                    {"value": "comma", "label": "Comma"}

                ]
            },

            "template": {
                "hideHeader": true
            }

        },

        "range": {

            "selector": {
                "id": "range",
                "default": [126],
                "config": { //specific ion.rangeSlider
                    type: "double",
                    min: 100,
                    max: 200
                },
                //"disabled" : true
            },

            "template": {
                "hideHeader": false,
                //"hideSwitch": true
            },

            //dependencies with other items
            "dependencies": {
                //@ for special selection
                //"@all": {id: "ensure_unset", event: "disable"} // obj, array of obj
            },

            "format": {
                //"output" : "codes", // codelist || time. if format is FENIX
                //"uid" : "myCodelist", //override codelist uid config
                //"version" : "myVersion", //override codelist version config
                //"dimension" : "myDimension", //override dimension uid, default is the selector id
            }
        },

        "sort": {

            "selector": {
                "id": "sortable",
                "source": [
                    {"value": "sort_1", "label": "my sort fn 1", parent: 'group-1'},
                    {"value": "sort_2", "label": "my sort fn 2", parent: 'group-1'},
                    {"value": "sort_3", "label": "my sort fn 3"},
                    {"value": "sort_4", "label": "my sort fn 4"},
                    {"value": "sort_5", "label": "my sort fn 5"}
                ], // Static data
                "config": { //SortableJS configuration
                    //disabled: true
                }
            },

            "template": {
                // "hideHeader": true
            }

        },

        "time": {

            "selector": {
                "id": "time",
                "default": ["Thu Mar 8 2016 17:04:58 GMT+0100 (CET)"],
                "config": {},//specific bootstrap datetimepicker
                //"disabled" : true
            },

            "template": {
                "hideHeader": false,
                //"hideSwitch": true
            },

            //dependencies with other items
            "dependencies": {
                //@ for special selection
                //"@all": {id: "ensure_unset", event: "disable"} // obj, array of obj
            },

            "format": {
                //"output" : "codes", // codelist || time. if format is FENIX
                //"uid" : "myCodelist", //override codelist uid config
                //"version" : "myVersion", //override codelist version config
                //"dimension" : "myDimension", //override dimension uid, default is the selector id
            }
        },

        "donor": {

            //"className" : "",

            "cl": {
                "uid": "crs_donors",
                "version": "2016"
            },

            "selector": {
                "id": "tree",
                //"disabled" : true,
                "hideSelectAllButton": true,
                //"source": [{"value": "myvalue", "label": "my custom label"}], // Static data
                //"default": [1012],
            },

            "dependencies": {
                "compare": {id: "focus", event: "select"} //obj or array of obj
            },

            "format": {
                "dimension": "donorcode",
                "type": "dynamic",
                "process": '{"donorcode": { "codes":[{"uid": "{{uid}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
            },

            "validation": {
                //"mandatory" : true
            }
        }

    }

});