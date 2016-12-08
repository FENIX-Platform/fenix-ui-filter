define(function () {

    return {

        sortable: {

            selector: {
                id: "sortable",
                source: [
                    {value: "item_1", label: "item_1", parent : "g_1"},
                    {value: "item_2", label: "item_2", parent : "g_2"}
                ],
                config : {
                    groups : {
                        g_1 : "Group 1",
                        g_2 : "Group 2"
                    }
                }
            },

            template : {
                hideRemoveButton : false,
                hideSwitch: false
            }
        },

        textarea: {

            selector: {
                id: "textarea"
            },

            template : {
                hideRemoveButton : false,
                hideSwitch: false
            }
        },

        time: {

            selector: {
                id: "time"
            },

            template : {
                hideRemoveButton : false,
                hideSwitch: false
            }
        },

        range: {

            selector: {
                id: "range",
                min : 10,
                max : 20

            },

            template : {
                hideRemoveButton : false,
                hideSwitch: false
            }
        },

        input: {

            selector: {
                id: "input",
                type: "checkbox",
                source: [
                    {value: "disable", label: "Disable"},
                    {value: "enable", label: "Enable"}
                ]
            },

            template : {
                hideRemoveButton : false,
                hideSwitch: false
            }
        },

        tree: {

            selector: {
                id: "tree",
                source: [
                    {value: "disable", label: "Disable"},
                    {value: "enable", label: "Enable"}
                ]
            },

            template : {
                hideRemoveButton : false,
                hideSwitch: false
            }
        },

        dropdown: {

            selector: {
                id: "dropdown",
                source: [
                    {value: "disable", label: "Disable"},
                    {value: "enable", label: "Enable"}
                ],
                config: {
                    maxItems: 1
                }
            },

            template : {
                hideRemoveButton : false,
                hideSwitch: false
            }
        },

    /*    selector: {
            selector: {
                id: "dropdown",
                source: [
                    {value: "one", label: "One"},
                    {value: "two", label: "Two"}
                ]
            },

            dependencies: {
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

        }*/
    }
});
