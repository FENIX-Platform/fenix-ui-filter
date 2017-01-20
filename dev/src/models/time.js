/*global define*/

define([
        'jquery',
        'moment'
    ],
    function ($, Moment) {

        'use strict';

        return {


            rangeDouble: {

                selector: {
                    id: "range",
                    config: {
                        min: 0,
                        max: 253402300799,
                        step: 86400,
                        type: "double",
                        prettify: function (num) {
                            return Moment(num, "X").format("DD-MM-YYYY");
                        }
                    }
                },

                template: {
                    title: "Double Range",
                    hideSwitch: false,
                    hideRemoveButton: false
                }

            },


            time: {

                selector: {
                    id: "time",
                    default: ["01/01/1980"]
                },

                template: {
                    title: "Time from string",
                    hideSwitch: false,
                    hideRemoveButton: false
                }
            },

            timeDisabled: {

                selector: {
                    id: "time",
                    default: ["946728000000"],
                    disabled: true
                },

                template: {
                    title: "Time at 01/01/2000 12:00 GMT+1",
                    hideSwitch: false,
                    hideRemoveButton: false
                }
            }

        }

    });