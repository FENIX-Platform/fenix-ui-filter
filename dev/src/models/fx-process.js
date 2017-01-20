/*global define*/

define(function () {

    'use strict';

    return {
        flude: [
            {
                "name": "filter",
                "parameters": {
                    "rows": {
                        "year": {"time": [{"from": 2015, "to": 2015}]},
                        "indicator": {"codes": [{"uid": "FLUDE_INDICATORS", "codes": ["Forest"]}]}
                    },
                    "columns": ["indicator"]
                }
            },
            {
                "name": "group",
                "parameters": {
                    "by": ["incomes", "indicator"],
                    "aggregations": [
                        {"columns": ["value"], "rule": "AVG"},
                    ]
                }
            },
            {"name": "order", "parameters": {"incomes": "ASC"}}]
    }

});

