/*global define*/

define(function () {

    'use strict';

    return {

        "switch" : {

            selector : {
                id : "input",
                type : "checkbox",
                source : [
                    {value : "true" , label : "True"}
                ],
                default : ["true"]
            }
        },

        tree : {
            selector : {
                id : "tree",
                source : [
                    {value : "adult" , label : "Adult"},
                    {value : "child" , label : "Child"}
                ],
                default : ["man"],
                hideButtons : false,
                hideSelectAllButton : true,
                hideClearAllButton : true,
                hideFilter : true
            },

            template : {
                hideSwitch : false,
                hideRemoveButton: false
            },

            dependencies : {
                interruttore : "disable"
            },
            
            format : {
                dimension : "dim1"
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
                        title : "Country"
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
                        //"disabled" : true,
                        title : "Region"
                    }

                },

                "regional-aggregation": {


                    label : "Tab 3",

                    "cl": {
                        "uid": "crs_regional_projects",
                        "version": "2016"
                    },

                    "selector": {
                        "id": "tree",
                        "hideSelectAllButton": true,
                        title : "Country / Region"
                    }
                }

            },

            "format": {
                "dimension": "recipientcode",
                "type": "dynamic", //dynamic | static: for dynamic or static section of D3P filter
                "process": '{"recipientcode": { "codes":[{"uid": "crs_recipients", "version": "2016", "codes": [{{{codes}}}] } ]}}'
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
        }
    }

});