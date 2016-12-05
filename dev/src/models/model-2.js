define(function () {

    return {

        "MicroDietaryComponents": {

            //disabled : true,

            "cl": {uid: 'GIFT_Micronutrients'},

            "selector": {
                "id": "dropdown",
                "sort": false,
                //default : ["13","01"]
            },

            "template": {
                "title": "Micronutrients available in the dataset",
                "hideDescription": true,
                "footer": "List micronutrients for which dietary intake has been calculated in the dataset",
            },

            "format": {
                "output": "codes:extended"
            }
        },

        "MicroDietaryComponentsDetails": {

            disabled : true,

            "incremental": true,

            classNames: "well",

            "template": {
                "title": "Micronutrients and minerals available in the dataset - details",
                "hideDescription": true,
                "footer": "List additional micronutrients reported here above as 'other'",
            },

            "selectors": {
                "MicroDietaryComponentsDetailsList": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [{"value": "MicroDietaryComponentsDetailsList"}]
                    },
                    "format": {
                        "output": "label"
                    },
                    "template": {
                        "title": "Micronutrients and minerals available in the dataset - details",
                        "hideDescription": true,
                        "footer": "List additional micronutrients reported here above as 'other'",
                    }
                }
            },

            format: {
                output: "array<label>"
            },

            dependencies: {
                MicroDietaryComponents: [{
                    id: "enableIfValue",
                    event: "select",
                    args: {value: "13"}
                }]
            }

        }



        /*   dropdown : {

         selector : {
         id  : "dropdown",
         source: [
         {value : "disable", label : "Disable"},
         {value : "enable", label : "Enable"}
         ],
         config : {
         maxItems : 1
         }
         }
         },

         selector : {
         selector : {
         id  : "dropdown",
         source: [
         {value : "one", label : "One"},
         {value : "two", label : "Two"}
         ]
         },

         dependencies : {
         dropdown: [{id: "readOnlyIfNotValue", event: "select", args: {value: "other"}}]
         }

         },

         contact: {

         selectors: {

         role: {

         template: {
         title: "This is the title",
         description: "This is the description",
         footer: "This is the footer"
         },

         enumeration: {
         uid: "ResponsiblePartyRole"
         },

         selector: {
         id: "tree",
         config: {
         maxItems: 1
         }
         },

         format: {
         output: "label"
         }

         },

         specify: {

         selector: {
         id: "textarea",
         source: [{"value": "specify", "label": "Specify"}]

         },

         format: {
         output: "label"
         }

         }
         },

         template: {
         title: "Title"
         },

         /!*dependencies : {
         dropdown: [{id: "readOnlyIfNotValue", event: "select", args: {value: "other"}}]
         }*!/
         }*/
    }
})
;
