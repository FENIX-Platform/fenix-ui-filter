# FENIX Filter

```javascript
var Filter = require('fenix-ui-filter');

var filter = new Filter({
        el : "#filter",
        selectors : {
            sel_1 : { /* selector configuration goes here */ }, 
            sel_2 : { ... }
        }
    });
```

# Commands

+ `npm run build` : builds in production mode
+ `npm run build:demo` : called after `npm run build`, builds the `demo` folder
+ `npm run dev` : launch `webpack-dev-server` for develop. Once server is started, its default url is `http://localhost:8080/webpack-dev-server/`
+ `npm t` : automated test

# Configuration

Check `fx-filter/config/config.js` to have a look of the default configuration.

<table>
   <thead>
      <tr>
         <th>Parameter</th>
         <th>Type</th>
         <th>Default Value</th>
         <th>Example</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>el</td>
         <td>CSS3 Item/JavaScript DOM element/jQuery DOM element</td>
         <td> - </td>
         <td>"#container"</td>
         <td>component container</td>
      </tr>
      <tr>
         <td>selectors</td>
         <td>Object</td>
         <td> - </td>
         <td> - </td>
         <td>The filter instance's selectors to render. Check the Item configuration. </td>
      </tr>
      <tr> 
         <td>template</td>
         <td>HTML</td>
         <td> - </td>
         <td> - </td>
         <td>The filter template to render selector with a specific layout.</td>
      </tr>
      <tr>
         <td>pluginRegistry</td>
         <td>object</td>
         <td>{ }</td>
         <td>-</td>
         <td>Keyset: plugins' ids. Value: object. path: plugin module path</td>
      </tr>
      <tr>
         <td>focusedItemClassName</td>
         <td>string</td>
         <td>"focused"</td>
         <td>"my-focused"</td>
         <td>CSS class applied to make a selector focused</td>
      </tr>
      <tr>
         <td>mandatoryItemClassName</td>
         <td>string</td>
         <td>"mandatory"</td>
         <td>"my-mandatory"</td>
         <td>CSS class applied to make a selector mandatory</td>
      </tr>
      <tr>
         <td>disabledItemClassName</td>
         <td>string</td>
         <td>"disabled"</td>
         <td>"my-disabled"'</td>
         <td>CSS class applied to make a selector disabled</td>
      </tr>
      <tr>
         <td>outputFormat</td>
         <td>string</td>
         <td>"plain"</td>
         <td>plain , fenix, catalog</td>
         <td>Default output format of getValues() fn</td>
      </tr>
      <tr>
         <td>direction</td>
         <td>string</td>
         <td>"append"</td>
         <td>"prepend"</td>
         <td>Direction of how the selector are added (if no template is provided)</td>
      </tr>
      <tr>
         <td>ensureAtLeast</td>
         <td>number</td>
         <td>-1</td>
         <td>1/td>
         <td>Min number of selector per filter instance</td>
      </tr>
      <tr>
         <td>summaryEl</td>
         <td>CSS3 Item/JavaScript DOM element/jQuery DOM element</td>
         <td>-</td>
         <td>"#summary-container"</td>
         <td>Container of the summary</td>
      </tr>
      <tr>
         <td>summaryRender</td>
         <td>function</td>
         <td> - </td>
         <td> - </td>
         <td>Custom renderer for summary</td>
      </tr>
      <tr>
         <td>values</td>
         <td>Object</td>
         <td> - </td>
         <td>{
                values : { 
                            indicator : ["cod_001"],
                            year : [{value: "2000", parent: "from"}, {value: "2016", parent: "to"}]}
                         },
                labels: {
                         ...
                         }
         </td>
         <td>Initial filter values, use plain format</td>
      </tr>
      <tr>
         <td>cache</td>
         <td>boolean</td>
         <td>false</td>
         <td>true</td>
         <td>whether or not to use FENIX bridge cache</td>
      </tr>
      <tr>
         <td>environment</td>
         <td>string</td>
         <td>'develop'</td>
         <td>'production'</td>
         <td>Server environment</td>
      </tr>
      <tr>
         <td>lang</td>
         <td>string</td>
         <td>'EN'</td>
         <td>'IT'</td>
         <td>Multilingual</td>
      </tr>
      <tr>
         <td>common</td>
         <td>object</td>
         <td>{
            template : {
            hideRemoveButton: true,
            hideSwitch: true,
            hideHeaderIcon: true
            }
            }
         </td>
         <td>-/td>
         <td>Common selector configuration. This will override the selector configuration</td>
      </tr>
   </tbody>
</table>

# Item configuration

This is the schema of a selector configuration

```javascript
{
 sel_1 : { // this will appear within the result of .getValues()
 
    classNames : "...", //custom CSS class for selector container
     
    selector : {}, // configuration of the selector
    
    selectors : {}, // in case of group selector 
    
    semantic : boolean, // in case of semantic group selector
    
    cl : {}, // specifies the code-list to use as selector source
     
    enumeration : {}, // specifies the enumeration to use as selector source
    
    template : {}, //configuration of the template in which the selector is rendered
     
    dependencies : {}, // in case the selector has dependencies with other selectors
     
    format : {} // configuration for .getValues() in case is not plain
        
    validation: {} // validation
     
    }
}
```

## Item 

```javascript
{
...
selector : { 
 
    id : "...", // id of the selector plugin to use. Check available selectors
 
    type : "...", // additional selector configuration. Ex: id:"input", type:"text"
 
    source : [ {value: "selector", label: "Item"} ], // static selector source. Merged to `cl` configuration
 
    default : [...], // default selector values
 
    disabled : false, // in case the selector is disabled by default
 
    config : {} // wrapped lib configuration
    
    backlist: [] // list of the code to exclude from selector
 
 }
...
}
```

## Code-list / Enumeration as selector source

This configuration proxies the information to D3S code-list / enumeration services

```javascript
{
...
    cl : { 
    
        uid : "...", // code-list/enumeration uid
        
        version : "...", // code-list/enumeration version
        
        level : "...", // code-list/enumeration initial selection level
        
        levels : "...", // starting from `level`, how many code-list/enumeration levels to include
    
    },
    
    enumeration : {
    
        // as above
    
    }
...
}
```

## Template

```javascript
{
...
    template : { 
    
        hideSwitch: true, // hide selector enable/disable switcher
        
        hideTitle : true, // Hide Title,
        
        hideDescription : true, // Hide description,
        
        hideHeader : true, // Hide Header,
        
        hideRemoveButton : false, // Hide remove button
        
        title : "..." // selector title,
        
        description : "..." // selector title,

    }
...
}
```

## Dependencies between selectors

```javascript
{
...
        dependencies: {
            //@ for special selection
            "@all": {id: "ensure_unset", event: "disable"} // obj, array of obj,
            sel_2 : {id: "parent", event: "select"}
        },
...
}
```

The previous configuration as to be read as following: say this is the configuration of `sel_1`, it has two dependencies.
The first one is a dependencies with all the selectors: when any of the selectors of the specific instance trigger the stated event,
the `ensure_unset` callback is called. The second one, when 'sel_2' trigger the `select` event, call the `parent` callback

### Available dependencies

NB: not all dependencies are compatible with all the available selectors. Check the compatibility tables. 

- `min` : set the payload value as min value of the selector
- `parent` : refresh the selector source considering the payload value as parent code
- `focus` : if the payload value is equal to the selector id, set the selector state to focused
- `ensure_unset` : ensure that the payload value is not selected in the specific selector
- `disable` : disable selector
- `process` : use a D3P process to populate a selector. The dependency configuration will be `[{id: "process", event:"...", args : { uid: <resource_uid>, version: <resource_version>, body: <place_d3p_process_here>, indexValueColumn: <number>, indexLabelColumn: <number>, payloadIncludes: [ <selector_id>, <"@all"> ]}]` and if the string `{{{codes}}}` (NB: three brackets!) will be found within the `<place_d3p_process_here>` it will be replaced with the concatenation of the codes that triggered the dependency call.

### Available events

NB: these are different events from filter global events 

- `select` : triggered when an selector's selector  is selected
- `disable` :  triggered when an selector is disabled
- `change` :  triggered when an selector change its state
- `ready` :  triggered each selector is rendered
- `remove` :  triggered each selector is removed

## Compatibility tables

TODO 

## Format

```javascript
{
...
    format : { // configuration for .getValues() in case is not plain
    
        output : "codes", // codes || enumeration || time. If format is 'fenix'
        
        uid : "myUid", // override code-list uid config
        
        version : "myVersion", // override code-list version config
        
        dimension : "myDimension", // override dimension uid, default is the selector id
    
    } 
...
}
```

## Validation

```javascript
{
    ...
    validation : { 
       mandatory : true //mandatory selector. Default false
    }
    
...
}
```

# Available selectors

The following are the default available selectors. The plugin registry can be extended with the `pluginRegistry` configuration.
In order to choose a specific selector specify the correspondent id in `selector.id` configuratino for each selector.
## Dropdown

Wrapped lib: [selectize.js](http://selectize.github.io/selectize.js/)

```javascript
//specific configuration
...
selector : {

    hideButtons : true, //hide all buttons,
    hideSelectAllButton: true, //Hide select all button
    hideClearAllButton : true, //Hide clear all button
    ...
    config : {
        maxItems: 1, // Max amount of selected selectors,
        placeholder: "Please select",
        plugins: ['remove_button'], //in combination with mode:'multi' create a 'X' button to remove selectors
        mode: 'multi'
    }
}
...
```

## Input
Wrapped lib: native HTML elements

```javascript
//specific configuration
...
selector : {
    ...
    type : "...", // to specify the input type. Every HTML input type is allowed
}
...
```

## Textarea
Wrapped lib: native HTML elements

```javascript
//specific configuration
...
selector : {
    ...
    config : {
        row: 100,
        cols: 150
    }
}
...
```

## Range
Wrapped lib: [ion.rangeSlider.js](http://ionden.com/a/plugins/ion.rangeSlider/en.html)

```javascript
//frequent config, check lib doc form more
...
selector : {
    ...
    format: "YYYY/MM/DD", //any moment js format
    config: {
        min: 100, /min range
        max: 200, // max range
        type: "double" // range type
    }
}
...
```
 
## Sortable
Wrapped lib: [sortable.js](http://rubaxa.github.io/Sortable/)

```javascript
//specific configuration
...
selector : {
    ...
    config : {
        groups: { // Configure groups: in case source selector has parent config [{value: ".", label: "X", parent: "group1"}]
            group1: 'Group 1', // group id and title
            },
        selectorRender : function ( model ) { }; //custom selector render function
        }
    }
...
```

## Time
Wrapped lib: [Bootstrap 3 Datepicker](https://eonasdan.github.io/bootstrap-datetimepicker/)

## Tree
Wrapped lib: [jstree](https://www.jstree.com/)

```javascript
//specific configuration
...
selector : {
    ...
    max : 2, //max number of selectable selectors
    lazy : true, //lazy loading of children selectors
    hideFilter : true, //hide filter
    hideButtons : true, //hide all buttons,
    hideSelectAllButton: true, //Hide select all button
    hideClearAllButton : true, //Hide clear all button
    hideFooter : true, //hide footer
    hideSummary : true, //Hide selection summary,
    ...
    },
summaryRender : function ( selector ) {} // custom summary render function
...
```

# Groups

It is possible to define a group selector. There are two kind of group selectors:
- standard group selector 
- semantic group selector 

A standard group selector is a group of selectors in each selector is active at the same time. It is a selector that contains many selectors. 
This is useful, for example, when a specific information can be described with different attributes (e.g. contact information contains name, surname, role, etc.).

A semantic group selectors is a group of selectors in which only one
 can be active. This is useful, for example, when a specific information can be selected in different manners (e.g. time selection, 
 with a calendar or a range).
 
# Filter layout definition
It is possible to specify where a selector has to be rendered.
FENIX Filter looks for `data-selector=":id"` or `data-group=":id"` where `:id` is the selector/group id within its `el`.
In case no container will be found, FENIX filter will add (append/prepend according to configuration) the container to its `el`.

It is possible to pass an HTML template using the `template` configuration that will be attached to the `el`.

# Demo

Browse the `demo` folder to visualize a showcase of the available selectors and configuration examples.

# API

```javascript
//This is an example
filter.getValues("fenix");
```

- `filter.getValues(format, includedItems)` : get filter values according to the specific format. Available format are 'plain' (default and optional), includedItems filter the selectors to include in the result
catalog, fenix. For more info che the `fx-common/utils` doc.
- `filter.setValues(values)` : set filter values. The syntax is the same of `filter.getValues()` 
- `filter.on(event, callback[, context])` : pub/sub 
- `filter.dispose()` : dispose the filter instance
- `filter.reset()` : reset filter instance
- `filter.printDefaultSelection()` : print default selection of filter. 
- `filter.add( selectors )` : add dynamically selectors to filter
- `filter.remove( selectors )` : remove dynamically selectors from filter
- `filter.clear()` : clear the filter from all selectors
- `filter.setSources( sources )` : set sources to specifies selectors. `sources` is an object: keys are the selectors id, values are sources in `selector.source` format

# Events

- `remove` : triggered when a selector is removed
- `ready` : triggered when the filter and all its initial selectors are rendered
- `change` : triggered when a selector state changes (selector selector selected, selector disabled, ecc...)

# Output formats

In order to have different output format pass the desired format to `filter.getValue( format )` function.

## Plain

Default output format. 

```javascript

{
    values : {
        sel_1 : ["cod_1"],
        sel_2 : ["fx"]
    },
    labels : {
        sel_1 : {
            cod_1 : "Code One"
        },
        sel_2 : {
            fx : "FENIX"
        }
    },
    valid : true
}
```

Where the keyset of `values` and `labels` is the set of selector ids of the filter.
`values` contains the selected values, `labels` the labels of selected values.
If a selector has no selected value, it is excluded from result.

## FENIX

If proper `format` configuration for each selector is provided, return a D3P process body with the selected values.

## Catalog

If proper `format` configuration for each selector is provided, return a D3S filter body with the selected values.
