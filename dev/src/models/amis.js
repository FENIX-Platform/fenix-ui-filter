/*global define*/

define(["moment"],function (moment) {

    'use strict';

    return {

        commodityDomain: {

            selector: {
                id: "input",
                type: "checkbox",
                source: [
                    {value: "1", label: "Agricultural"},
                    {value: "2", label: "Biofuels"}
                ],
                default: ["1"],
                hideSelectAllButton: false,
                hideClearAllButton: false
            },

            template: {
                title: "Commodity Domain"
            }
        },

        policyDomain: {

            selector: {
                id: "input",
                type: "checkbox",
                source: [
                    {value: "1", label: "Trade"},
                    {value: "2", label: "Domestic"}
                ],
                default: ["1"],
                hideSelectAllButton: false,
                hideClearAllButton: false
            },

            template: {
                title: "Policy Domain"
            }
        },

        policyType: {

            selector: {
                id: "dropdown",
                source: [
                    {value: "1", label: "Agricultural"},
                    {value: "2", label: "Biofuels"}
                ],
                hideSelectAllButton: false,
                hideClearAllButton: false,

            },

            template: {
                title: "Policy Type"
            },

            dependencies: {
                commodityDomain: [{
                    id: "process",
                    event: "select",
                    args: {
                        uid: "OECD_View_QueryDownload",
                        payloadIncludes: ["commodityDomain", "policyDomain"],
                        //indexValueColumn : 1,
                        //indexLabelColumn : 0,
                        body: [{
                            name: "filter",
                            parameters: {
                                rows: {
                                    commoditydomain: {
                                        codes: [{
                                            uid: "OECD_CommodityDomain",
                                            version: "1.0",
                                            codes: ["{{commodityDomain}}"]
                                        }]
                                    },
                                    policydomain: {
                                        codes: [{
                                            uid: "OECD_PolicyDomain",
                                            version: "1.0",
                                            codes: ["{{policyDomain}}"]
                                        }]
                                    }
                                },
                                columns: ["policytype"]
                            }
                        }]
                    }
                }]
            }
        },

        policyMeasure: {

            selector: {
                id: "dropdown",
                hideSelectAllButton: false,
                hideClearAllButton: false
            },

            cl: {
                uid: "OECD_PolicyType2_1_1",
                version: "1.0"
            },

            template: {
                title: "Policy Measure"
            }
        },
/*
        commodityClass: {

            selector: {
                id: "dropdown",
                hideSelectAllButton: false,
                hideClearAllButton: false
            },

            cl: {
                "uid": "OECD_CommodityClass1",
                "version": "1.0"
            },

            template: {
                title: "Commodity Class"
            }
        },*/

        /*country: {

            selector: {
                id: "dropdown",
                hideSelectAllButton: false,
                hideClearAllButton: false
            },

            cl: {
                "uid": "OECD_Country",
                "version": "1.0"
            },

            template: {
                title: "Country"
            }
        },

        year: {

            selectors: {

                YearSlider: {

                    className: 'col-md-10',

                    selector: {
                        id: "range",
                        //config: {
                        //    min: 2011,
                        //    max: 2014,
                        //    from: 2012,
                        //    to: 2013,
                        //    type: "double"
                        //}
                        //config: {
                        //    type: "double",
                        //    min: +moment().subtract(1, "years").format("X"),
                        //    max: +moment().format("X"),
                        //    from: +moment().subtract(6, "months").format("X"),
                        //    prettify: function (num) {
                        //        console.log(num)
                        //        return moment(num, "X").format("LL");
                        //    }
                        //}
                        config: {
                            type: "double",
                            min: +moment('2011-01-01').format("X"),
                            max: +moment('2014-01-01').format("X"),
                            from: +moment('2012-01-01').format("X"),
                            to: +moment('2013-01-01').format("X"),
                            prettify: function (num) {
                                return moment(num, "X").format("MM/YYYY");
                            }
                        }
                    },

                    template: {
                        title: "Years Slider"
                    }

                    //dependencies : {"commodityDomain": [{
                    //    "id": "process", "event":"select", "params":  [{"name": "filter", "sid": {"uid": "OECD_View_QueryDownload"}, "parameters": {"columns" :["startDate", "endDate"]}}]
                    //}]
                    //}
                },
                YearList: {
                    selector: {
                        id: "dropdown",
                        source: [
                            {value: "item_3", label: "Item 3"},
                            {value: "item_4", label: "Item 4"}
                        ],
                        hideSelectAllButton: false,
                        hideClearAllButton: false
                    },

                    template: {
                        title: "Year List"
                    }

                    //dependencies : {
                    //    "commodityDomain": [{
                    //        "id": "process",
                    //        "event": "select",
                    //        "params": [{
                    //            "name": "filter",
                    //            "sid": {"uid": "OECD_View_QueryDownload"},
                    //            "parameters": {"columns": ["startDate", "endDate"]}
                    //        }]
                    //    }]
                    //}
                }
            },

            template: {
                hideHeader: true
            }
        }*/

    }
});