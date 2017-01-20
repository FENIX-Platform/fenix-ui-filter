/*global define*/

define(function () {

    'use strict';

    return {

        "sort": {

            "selector": {
                "id": "sortable",
                "source": [
                    {"value": "sort_1", "label": "my sort fn 1", parent: 'group-1', parentLabel : "Group 1"},
                    {"value": "sort_2", "label": "my sort fn 2", parent: 'group-1'},
                    {"value": "sort_3", "label": "my sort fn 3", parentLabel: 'Group 2'},
                    {"value": "sort_4", "label": "my sort fn 4"},
                    {"value": "sort_5", "label": "my sort fn 5"}
                ], // Static data
                "config": { //SortableJS configuration
                    //disabled: true
                }
            },

            "template": {
               // "hideHeader": true
            },

            "className": "col-xs-12"

        },

        "decimals": {

            "selector": {
                "id": "input",
                "type": "number",
                "source": [
                    {"value": "2"}
                ],
                "config" : {
                    min : 0,
                    max : 10
                }
            },

            "template" : {
                "hideHeader" : true
            },


            "className" : "col-xs-6"

        }

        
        /*        "aggregation": {

         "selector": {
         "id": "dropdown",
         "source": [
         {"value": "aggregation_1", "label": "my aggregation fn 1"},
         {"value": "aggregation_2", "label": "my aggregation fn 2"},
         {"value": "aggregation_3", "label": "my aggregation fn 3"},
         {"value": "aggregation_4", "label": "my aggregation fn 4"},
         {"value": "aggregation_5", "label": "my aggregation fn 5"}
         ], // Static data
         "config": { //Selectize configuration
         "maxItems": 1
         }
         },

         "template" : {
         "hideHeader" : true
         },

         "className" : "col-xs-6"

         },

         "decimal_separator": {

         "selector": {
         "id": "input",
         "type": "radio",
         "default" : ["dot"],
         "source": [
         {"value": "dot", "label": "Dot"},
         {"value": "comma", "label": "Comma"}

         ]
         },


         "template" : {
         "hideHeader" : true
         },


         "className" : "col-xs-6"

         },

         "thousand": {

         "selector": {
         "id": "input",
         "type": "radio",
         "default" : ["enable"],
         "source": [
         {"value": "enable", "label": "Enable"},
         {"value": "disable", "label": "Disable"}
         ]
         },


         "template" : {
         "hideHeader" : true
         },

         "className" : "col-xs-6"

         }
*/
    }

});