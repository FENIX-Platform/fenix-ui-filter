/*global define*/

define(function () {

    'use strict';

    return {

        tree : {

            className : 'col-xs-4',

            selector : {
                id : 'tree',
                source :[
                    { value: 'dani', label : 'Dani'},
                    { value: 'nic', label : 'Nic'}
                ]
            },

            template : {
                title: 'NICOLA'
            },

            dependencies : {
                switch : [{event: 'select', id: 'disable'}]
            }
        },

        switch : {

            className : 'col-xs-4',

            selector : {
                id : 'input',
                type: 'checkbox',
                source :[
                    { value: 'true', label : 'Enable'}
                ],
                default : 'true'
            }
        },

        sortable : {

            className : 'col-xs-4',

            selector : {
                id : 'sortable',
                source :[
                    { value: 'true', label : 'Disable', parent : 'group1'},
                    { value: 'no', label : 'NU' , parent : 'group2'},
                    { value: 'nos', label : 'NU' , parent : 'group3'}
                ],
                config : {
                    groups: {
                        group1: 'Group 1',
                        group2: 'Group 2',
                        group3: 'Group 3'
                    },
                    itemRender : function ( model ) {

                        var template = $('<div> Ciao!: ' +model.label +'</div>');

                        template.on('click', function () {
                            console.log('Hello!')
                        });


                        return template;

                    }
                }
            }
        }

    }

});