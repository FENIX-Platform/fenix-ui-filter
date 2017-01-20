/*global define*/

define(function () {

    'use strict';

    return {
        "metadata": {
            "uid": "TEST_DSD_JSON",
            "title": {
                "EN": "Test dataset 1"
            },
            "meContent": {
                "resourceRepresentationType": "dataset"
            },
            "dsd": {
                "contextSystem": "test",
                "datasources": [
                    "D3S"
                ],
                "aggregationRules": null,
                "columns": [
                    {
                        "id": "DIMENSION1",
                        "key": true,
                        "subject": "geo",
                        "dataType": "code",
                        "title": {
                            "EN": "region"
                        },
                        "supplemental": {
                            "EN": "List of geographic regions the value refers to"
                        },
                        "domain": {
                            "codes": [
                                {
                                    "idCodeList": "GAUL0",
                                    "version": "2014"
                                }
                            ]
                        }
                    },
                    {
                        "id": "DIMENSION2",
                        "title": {
                            "EN": "Item crs_purposes"
                        },
                        "supplemental": {
                            "EN": "Item column"
                        },
                        "subject": "item",
                        "dataType": "code",
                        "domain": {
                            "codes": [
                                {
                                    "idCodeList": "crs_purposes",
                                    "version": 2016
                                }
                            ]
                        },
                        "columnLink": null,
                        "key": true,
                        "transposed": false,
                        "virtual": false,
                        "values": null
                    },
                    {
                        "id": "DIMENSION3",
                        "title": {
                            "EN": "Item 2"
                        },
                        "supplemental": {
                            "EN": "Item with customCode as dataType"
                        },
                        "subject": "item",
                        "dataType": "customCode",
                        "domain": {
                            "codes": [
                                {
                                    "codes": [
                                        {
                                            "code": "01",
                                            "label": {"EN": "Wheat"}
                                        },
                                        {
                                            "code": "02",
                                            "label": {"EN": "Cassava"}
                                        },
                                        {
                                            "code": "03",
                                            "label": {"EN": "Sugar cane"}
                                        },
                                        {
                                            "code": "04",
                                            "label": {"EN": "Rice"}
                                        },
                                        {
                                            "code": "05",
                                            "label": {"EN": "Maize"}
                                        }
                                    ]
                                }
                            ]
                        },
                        "columnLink": null,
                        "key": true,
                        "transposed": false,
                        "virtual": false,
                        "values": null
                    },
                    {
                        "id": "DIMENSION4",
                        "title": {
                            "EN": "Item 3"
                        },
                        "supplemental": {
                            "EN": "Item with enumeration as dataType"
                        },
                        "subject": "item",
                        "dataType": "enumeration",
                        "domain": {
                            "enumeration": [
                                "High",
                                "Low",
                                "Lower Middle",
                                "Upper Middle",
                                "Unknown"
                            ]
                        },
                        "columnLink": null,
                        "key": true,
                        "transposed": false,
                        "virtual": false,
                        "values": null
                    },
                    {
                        "id": "DIMENSION5",
                        "key": true,
                        "subject": "time",
                        "dataType": "year",
                        "title": {
                            "EN": "timeYear1"
                        },
                        "supplemental": {
                            "EN": "Time dimension expressed in year, the domain is expressed as a period"
                        },
                        "domain": {
                            "period": {
                                "from": 2010,
                                "to": 2016
                            }
                        }
                    },
                    {
                        "id": "DIMENSION6",
                        "key": true,
                        "subject": "time",
                        "dataType": "year",
                        "title": {
                            "EN": "timeYear2"
                        },
                        "supplemental": {
                            "EN": "Time dimension expressed in year, the domain is expressed as a timeList"
                        },
                        "domain": {
                            "timeList": [
                                2010,
                                2011,
                                2012,
                                2016
                            ]
                        }
                    },
                    {
                        "id": "DIMENSION71",
                        "key": true,
                        "subject": "time",
                        "dataType": "month",
                        "title": {
                            "EN": "timeMonth1"
                        },
                        "supplemental": {
                            "EN": "Time dimension expressed in months, the domain is expressed as a period"
                        },
                        "domain": {
                            "period": {
                                "from": 201003,
                                "to": 201603
                            }
                        }
                    },
                    {
                        "id": "VALUE0",
                        "title": {
                            "EN": "ValueNumber"
                        },
                        "dataType": "number",
                        "subject": "value"
                    },
                    {
                        "id": "VALUE1",
                        "title": {
                            "EN": "ValuePerc"
                        },
                        "dataType": "percentage",
                        "subject": "value"
                    },
                    {
                        "id": "VALUE2",
                        "title": {
                            "EN": "ValueBool"
                        },
                        "dataType": "bool",
                        "subject": "value"
                    },
                    {
                        "id": "OTHER0",
                        "title": {
                            "EN": "Unit of measure"
                        },
                        "supplemental": {
                            "EN": "The UM has been specified as a text"
                        },
                        "dataType": "text",
                        "subject": "um"
                    },
                    {
                        "id": "OTHER1",
                        "key": false,
                        "subject": "flag",
                        "dataType": "label",
                        "title": {
                            "EN": "flag"
                        },
                        "supplemental": {
                            "EN": "The flag has been specified as a label"
                        }
                    },
                    {
                        "id": "DIMENSION7",
                        "key": true,
                        "subject": "time",
                        "dataType": "month",
                        "title": {
                            "EN": "timeMonth2"
                        },
                        "supplemental": {
                            "EN": "Time dimension expressed in months, the domain is expressed as a timeList"
                        },
                        "domain": {
                            "timeList": [
                                201003,
                                201004,
                                201005,
                                201012
                            ]
                        }

                    },
                    {
                        "id": "DIMENSION8",
                        "key": true,
                        "subject": "time",
                        "dataType": "date",
                        "title": {
                            "EN": "timeDate1"
                        },
                        "supplemental": {
                            "EN": "Time dimension expressed in dates, the domain is expressed as a period"
                        },
                        "domain": {
                            "period": {
                                "from": 201003,
                                "to": 201603
                            }
                        }
                    },
                    {
                        "id": "DIMENSION9",
                        "key": true,
                        "subject": "time",
                        "dataType": "date",
                        "title": {
                            "EN": "timeDate2"
                        },
                        "supplemental": {
                            "EN": "Time dimension expressed in dates, the domain is expressed as a timeList"
                        },
                        "domain": {
                            "timeList": [
                                20100301,
                                20100402,
                                20100510,
                                20101231
                            ]
                        }
                    },
                    {
                        "id": "DIMENSION10",
                        "key": true,
                        "subject": "time",
                        "dataType": "time",
                        "title": {
                            "EN": "timeDate1"
                        },
                        "supplemental": {
                            "EN": "Time dimension expressed in time, the domain is expressed as a period"
                        },
                        "domain": {
                            "period": {
                                "from": 20160310135722,
                                "to": 20160315135722
                            }
                        }
                    },
                    {
                        "id": "DIMENSION11",
                        "key": true,
                        "subject": "time",
                        "dataType": "time",
                        "title": {
                            "EN": "timeDate2"
                        },
                        "supplemental": {
                            "EN": "Time dimension expressed in time, the domain is expressed as a timeList"
                        },
                        "domain": {
                            "timeList": [
                                20160310135722
                            ]
                        }
                    }
                ]
            }
        }
    }

});