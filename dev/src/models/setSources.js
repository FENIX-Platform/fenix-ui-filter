define(function () {

    return {

        "tree": {
            "cl": {"uid": "UNECA_ISO3"},
            "selector": {
                "id": "tree",
                "hideSummary": true,
                "lazy": true
            },
            "template": {
                hideSwitch: true,
                hideRemoveButton: false
            },
            "format": {"dimension": "CountryCode"}
        },

        "dropdown": {
            "cl": {"uid": "UNECA_ISO3"},
            "selector": {
                "id": "dropdown",
                //hideButtons : false, //hide all buttons,
                //hideSelectAllButton: true, //Hide select all button
                //hideClearAllButton : true, //Hide clear all button
            },
            "template": {
                "hideSwitch": true
            },
            "format": {"dimension": "CountryCode"}
        },
        "range": {

            "selector": {
                "id": "range",
                source : [{value : "1462053600", label: "1462053600", parent: 'from'}, {value : "1462099999", label: "1462099999", parent: 'to'}],
                //hideButtons : false, //hide all buttons,
                //hideSelectAllButton: true, //Hide select all button
                //hideClearAllButton : true, //Hide clear all button
            },
            "template": {
                "hideSwitch": true
            }
        },

    }


});