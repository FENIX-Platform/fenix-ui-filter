define(function () {

    return {

         dropdown: {
             //cl: {"uid": "UNECA_ISO3"},
             selector: {
                 id: "dropdown",
                 /*               source : [
                  {value: "1", label : "One"},
                  {value: "2", label : "Two"},
                  {value: "3", label : "Three"}
                  ],*/
                 default: ["DZA", "ZAF", "Daniele"],
                 config: {
                     plugins: ['remove_button'],
                     delimiter: ',',
                     persist: false,
                     create: function (input) {
                         return {
                             value: input,
                             text: input
                         }
                     }
                 }
             },
             template : {
                 hideRemoveButton: false,
                 hideSwitch : false
             }
         }
    }
});
