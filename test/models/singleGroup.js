module.exports = {

    item : {

        selectors : {

            first : {
                selector : {
                    id : 'tree',
                    source : [
                        {value : 'item_1', label : "Item 1"},
                        {value : 'item_2', label : "Item 2"},
                        {value : 'item_3', label : "Item 3"}
                    ],
                    default : ['item_1']
                }
            },

            second : {
                selector : {
                    id : 'tree',
                    source : [
                        {value : 'item_1', label : "Item 1"},
                        {value : 'item_2', label : "Item 2"},
                        {value : 'item_3', label : "Item 3"}
                    ],
                    default : ['item_2']
                }
            }

        }

    }
};