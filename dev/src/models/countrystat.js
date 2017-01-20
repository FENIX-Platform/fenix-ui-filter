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
                "hideSwitch": true
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
            dependencies: {
                tree: [{
                    id: "process",
                    event: "select",
                    params: {
                        uid: "UNECA_Labour",
                        body: [{
                            "name": "filter",
                            "parameters": {
                                "rows": {
                                    "IndicatorCode": {
                                        "codes": [{
                                            "uid": "UNECA_ClassificationOfActivities",
                                            "version": "2.0",
                                            "codes": ["{{codes}}"]
                                        }]
                                    },
                                    "SectorCode": {"codes": [{"uid": "UNECA_EconomicSector", "codes": ["4"]}]},
                                    "GenderCode": {"codes": [{"uid": "UNECA_Gender", "codes": ["1", "2"]}]},
                                    "CountryCode": {
                                        "codes": [{
                                            "uid": "UNECA_ISO3",
                                            "codes": ["KEN", "TZA", "ZMB", "ETH"]
                                        }]
                                    },
                                    "Year": {"time": [{"from": 2010, "to": 2010}]}
                                }
                            }
                        }]
                    }
                }]
            },
            "format": {"dimension": "CountryCode"}
        },

    }


});