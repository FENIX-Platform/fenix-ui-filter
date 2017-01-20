/*global define*/

define(function () {

    'use strict';

    return {

        "range": {

            "selector": {
                "id": "range",
                "default": [126],
                "config" : { //specific ion.rangeSlider
                    type : "double",
                    min: 100,
                    max: 200
                },
                //"disabled" : true
            },

            "template": {
                "hideHeader": false,
            },

            //dependencies with other items
            "dependencies": {
                //@ for special selection
                //"@all": {id: "ensure_unset", event: "disable"} // obj, array of obj
            },

            "format" : {
                //"output" : "codes", // codelist || time. if format is FENIX
                //"uid" : "myCodelist", //override codelist uid config
                //"version" : "myVersion", //override codelist version config
                //"dimension" : "myDimension", //override dimension uid, default is the selector id
            }
        },

        "time": {

            "selector": {
                "id": "time",
                "default": ["Thu Mar 8 2016 17:04:58 GMT+0100 (CET)"],
                "config" : {  },//specific bootstrap datetimepicker
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

            "format" : {
                //"output" : "codes", // codelist || time. if format is FENIX
                //"uid" : "myCodelist", //override codelist uid config
                //"version" : "myVersion", //override codelist version config
                //"dimension" : "myDimension", //override dimension uid, default is the selector id
            }
        },

        "compare": {

            "selector": {
                "id": "input",
                "type" : "radio", //text || radio || checkbox || number
                //"source" : [ {"value" : "myvalue", "label" : "my custom label"}, {"value" : "myvalue 2", "label" : "my custom label 2 "} ], // Static data
                "default": ["recipient"],
                //"disabled" : true
            },

            "template": {
                "hideHeader": false,
                "hideSwitch": true
            },

            //dependencies with other items
            "dependencies": {
                //@ for special selection
                "@all": {id: "ensure_unset", event: "disable"} // obj, array of obj
            },

            "format" : {
                //"output" : "codes", // codelist || time. if format is FENIX
                //"uid" : "myCodelist", //override codelist uid config
                //"version" : "myVersion", //override codelist version config
                //"dimension" : "myDimension", //override dimension uid, default is the selector id
            }
        },

        "recipient": {

            //"className" : "myclass mysecondclass", //Add custom class[s] to selector container

            "items": {

                //selector id
                "country-country": {

                    //body sent to msd/codes/filter
                    "cl": {
                        "uid": "crs_recipientcountries", //for pure country list "crs_recipients"
                        "version": "2016"
                        //, level: 3,
                        //levels: 3,
                    },

                    //html selector configuration
                    "selector": {
                        "id": "tree", //tree | list
                        "default": [625 /*, 261, 269 */], //selected codes by default,
                        //"max" : 2, //max number of selectable items
                        //"disabled" : true, //if present and true the selector is initially disabled
                        //"config" : { core: { multiple: true } } //specific jstree or selectize config
                        //"blacklist": [] //codes to exclude from the codelist
                        //"hideFilter" : true, //hide filter buttons,
                        "hideButtons" : true, //hide all buttons,
                        "hideSelectAllButton": true, //Hide select all button
                        //"hideClearAllButton" : true, //Hide clear all button
                        //"hideFooter" : true, //hide footer
                        //"hideSummary" : true, //Hide selection summary,
                    }
                },

                "country-region": {

                    "cl": {
                        "uid": "crs_regions_countries",
                        "version": "2016"
                    },

                    "selector": {
                        "id": "tree",
                        "blacklist": [298, 189, 289, 498, 389, 380, 489, 798, 789, 689, 619, 679, 89, 589, 889], //code to exclude from the codelist
                        "hideSelectAllButton": true,
                        //"disabled" : true
                    }

                },

                "regional-aggregation": {

                    "cl": {
                        "uid": "crs_regional_projects",
                        "version": "2016"
                    },

                    "selector": {
                        "id": "tree",
                        "hideSelectAllButton": true
                    }
                }

            },

            "format": {
                "dimension": "recipientcode",
            },

            //dependencies with other items
            "dependencies": {
                "compare": {id: "focus", event: "select"} //obj or array of obj
            },

            "template": {
                //"hideSwitch": true, // hide selector enable/disable switcher
                //"hideTitle" : true, // Hide Title
                //"hideHeader" : true, // Hide Header
            },

            // validation
            "validation": {
                //"mandatory" : true //mandatory selector. Default false
            }
        },

        "donor": {

            //"className" : "col-xs-6",

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
        },

        "delivery": {

            "cl": {
                "uid": "crs_channels",
                "version": "2016",
                "level": 3,
                "levels": 3
            },

            "selector": {
                "id": "tree",
                "hideSelectAllButton": true,
                //"disabled" : true
                // "default": [44006]
            },

            "dependencies": {
                "compare": {id: "focus", event: "select"} //obj or array of obj
            },

            "template": {
                //"hideSwitch" : true //hide selector enable/disable switcher
            },

            "format": {
                "dimension": "channelcode",
                "type": "dynamic",
                "process": '{"channelcode": { "codes":[{"uid": "{{{uid}}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
            },

            "validation": {
                //"mandatory" : true
            }
        },

        "sector": {

            "cl": {
                "uid": "crs_dac",
                "version": "2016",
                "level": 1,
                "levels": 1
            },

            "selector": {
                "id": "tree",
                "default": [600],
                "hideSelectAllButton": true
            },

            "dependencies": {
                "compare": {id: "focus", event: "select"} //obj or array of obj
            },

            "format": {
                "dimension": "sectorcode",
                "type": "dynamic",
                "process": '{"parentsector_code": { "codes":[{"uid": "{{{uid}}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
            },

            "validation": {
                //"mandatory" : true
            }
        },

        "sub-sector": {

            "cl": {
                "uid": "crs_dac",
                "version": "2016",
                "level": 2,
                "levels": 2
            },

            "selector": {
                "id": "tree",
                "hideFooter": true
                //"default": [31165]
            },

            "format": {
                "dimension": "purposecode",
                "type": "dynamic",
                "process": '{"purposecode": { "codes":[{"uid": "crs_purposes", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
            },

            "dependencies": {
                "sector": {id: "parent", event: "select"}, //obj or array of obj
                "compare": {id: "focus", event: "select"}
            },

            "validation": {
                //"mandatory" : true
            }
        },

      /*  "oda": {

            "cl": {
                "uid": "crs_flow_amounts",
                "version": "2016"
            },

            "selector": {
                "id": "dropdown",
                //"source": [{"value": "myvalue", "label": "my custom label"}], // Static data
                "default": ["adam_usd_commitment"],
                "config": { //Selectize configuration
                    "maxItems": 1
                },
                //"disabled" : true
            },

            "format": {
                "id": "static"
            }

        },

        "year-from": {

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
                "type": "static",
                "output" : "time",
                //"process": '{"year": { "time":[{"from": "{{year-from}}", "to": "{{year-to}}" } ]}}'
            },

            "template": {
                "hideSwitch": true
            }
        },

        "year-to": {

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
                "type": "static",
                "output" : "time"
                //, "process": '{"year": { "time":[{"from": "{{year-from}}", "to": "{{year-to}}" } ]}}' //Not used
            },

            "dependencies": {
                "year-from": {id: "min", event: "select"}
            },

            "template": {
                "hideSwitch": true
            }

        }*/
    }

});