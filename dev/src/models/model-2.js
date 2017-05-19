define(function () {

    return {
        "DomainCode": {
            "distinct": {
                "uid": "Uneca_PopulationNew",
                "columnId": "DomainCode",
                "columnDataType": "code"
            },
            "selector": {"id": "tree", "config": {"core": {"multiple": true}}},
            "format": {"output": "codes", "uid": "UNECA_ClassificationOfActivities", "dimension": "DomainCode"},
            "template": {"title": "Domain"}
        },
        "TopicCode": {
            "distinct": {"uid": "Uneca_PopulationNew", "columnId": "TopicCode", "columnDataType": "code"},
            "selector": {
                "id": "tree",
                "config": {"core": {"multiple": true}}
                },
            "format": {"output": "codes", "uid": "UNECA_ClassificationOfActivities", "dimension": "TopicCode"},
            "template": {"title": "Topic"}
        },
        "IndicatorCode": {
            "distinct": {
                "uid": "Uneca_PopulationNew",
                "columnId": "IndicatorCode",
                "columnDataType": "code"
            },
            "selector": {"id": "tree", "config": {"core": {"multiple": true}}},
            "format": {"output": "codes", "uid": "UNECA_ClassificationOfActivities", "dimension": "IndicatorCode"},
            "template": {"title": "Indicator"}
        },
        "CountryCode": {
            "distinct": {"uid": "Uneca_PopulationNew", "columnId": "CountryCode", "columnDataType": "code"},
            "selector": {
                "id": "tree",
                "config": {"core": {"multiple": true}},
                "sort": true
                },
            "format": {"output": "codes", "uid": "ISO3", "dimension": "CountryCode"},
            "template": {
                "title": "Country",
                "hideSummaryCode" : false
            }
        },
        "Year": {
            "selector": {"id": "tree", "config": {"core": {"multiple": true}}},
            "format": {"output": "time", "dimension": "Year"},
            "distinct": {"uid": "Uneca_PopulationNew", "columnId": "Year", "columnDataType": "number"},
            "template": {"title": "Year"}
        },
        "GenderCode": {
            "distinct": {"uid": "Uneca_PopulationNew", "columnId": "GenderCode", "columnDataType": "code"},
            "selector": {"id": "tree", "config": {"core": {"multiple": true}}},
            "format": {"output": "codes", "uid": "UNECA_Gender", "dimension": "GenderCode"},
            "template": {"title": "Gender"}
        },
        "AgeRangeCode": {
            "distinct": {
                "uid": "Uneca_PopulationNew",
                "columnId": "AgeRangeCode",
                "columnDataType": "code"
            },
            "selector": {"id": "tree", "config": {"core": {"multiple": true}}},
            "format": {"output": "codes", "uid": "UNECA_AgeRange", "dimension": "AgeRangeCode"},
            "template": {"title": "Age Range"}
        }
    }
});
