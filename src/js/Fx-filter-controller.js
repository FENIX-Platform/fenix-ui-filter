define([
    'jquery',
    'fx-filter/componentcreator',
    'fx-filter/layoutfactory',
    'bootstrap'
], function ($, ComponentCreator, LayoutFactory) {

    'use strict';

    var optionsDefault = {
        mainContent : '',
        //Grid that contains the filter
        grid : '',
        components_map : {},

        current_layout :'',
        //Object of the current layout
        layout_render : '',

        html_ids : {
            MAIN_CONTAINER: "fx-filter_container"
        },

        class_ids : {
            ITEM_COMPONENT: "fx-catalog-form-module"
        },

        //The list of the filter event
        events: {
            REMOVE_MODULE: "fx.filter.module.remove"
        },

        //The list of the components event
        component_event: {
            //This is raise after the render of the component
            READY :"fx.filter.component.ready"
        },

        //Events for host
        host_event: {
            COMPONENT_READY : "fx.host.component.ready"
        },

        module_id : 31,
        filter_module_array :[],

        prefix_plugin_dir : '',
        plugin_subdir : '',

        container_plugin_dir : 'src/js/container_plugin/',
        component_plugin_dir : 'src/js/component_plugin/'
    },  componentCreator;

    function FC( o ){

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);

        //Creation of the filter container
        //to put inside the filter content located in the
        //host application
        var main_content = document.getElementById(this.options.mainContent);
        if(main_content!=null && typeof main_content!="undefined"){
            while (main_content.firstChild) {
                main_content.removeChild(main_content.firstChild);
            }
        }

        var c = document.createElement('DIV');
        //The Main Container is main container filter + host container id
        this.options.html_ids.MAIN_CONTAINER = this.options.html_ids.MAIN_CONTAINER +"_"+this.options.mainContent;
        c.id = this.options.html_ids.MAIN_CONTAINER;
        main_content.appendChild(c);

        componentCreator = new ComponentCreator();
        componentCreator.init({plugin_folder: this.options.prefix_plugin_dir + this.options.component_plugin_dir});

    }

    FC.prototype.initEventListeners = function () {

        var self = this;

        $('body').on(self.options.events.REMOVE_MODULE, function(event, properties){
            //Removing module
            for(var i=0; i<self.options.filter_module_array.length; i++){
                if(self.options.filter_module_array[i].options.id==properties.moduleObj.options.id){
                    self.options.filter_module_array.splice(i, 1);
                }
            }
        });
    }

    FC.prototype.initComponentsEventListener = function () {
        var self = this;
        //This happen when the component has been rendered
        $('body').on(self.options.component_event.READY, function(event, properties){

            if((properties!=null)&&(typeof properties!="undefined")&&(properties.name !=null)&&(typeof properties.name !="undefined")){
                self.setDomainByAdapter(properties.name);
            }
            //The host can set now the domain
            $('body').trigger(self.options.host_event.COMPONENT_READY, properties);
        });
    };

    FC.prototype.renderComponents = function () {
    };

    FC.prototype.add = function (modules_array, adapter_map) {
        if((modules_array!=null)&&(typeof modules_array!="undefined")&&(modules_array.length>0)){
            for(var i=0; i<modules_array.length; i++) {
                //Add in the DOM
                var element = modules_array[i];
                var options = {"mainContent":this.options.mainContent, "MAIN_CONTAINER": this.options.html_ids.MAIN_CONTAINER, "module_id": this.options.module_id, "container_plugin_dir": this.options.container_plugin_dir, "component_plugin_dir": this.options.component_plugin_dir}
                var newModule = this.options.layout_render.add(element, adapter_map, options, i, componentCreator);
                if((newModule!=null)&&(typeof newModule!='undefined')){
                    this.options.module_id++;
                    this.options.filter_module_array.push(newModule);
                }
            }
        }
    }

    //After the component render the host can decide to set the domain
    FC.prototype.setDomain = function (component_name, source) {
        if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
            for(var i=0; i<this.options.filter_module_array.length; i++){
//                var component = this.options.filter_module_array[i].options.component;
                var components = this.options.filter_module_array[i].options.container.options.components;
                for(var iComp = 0; iComp<components.length; iComp++){
                    var modulename = components[iComp].options.name;
                    if(modulename==component_name){
                        components[iComp].setDomain(source);
                    }
                }
            }
        }
    }

    //After the component render the host can decide to set the domain
    FC.prototype.setDomainByAdapter = function (component_name) {
        if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
            for(var i=0; i<this.options.filter_module_array.length; i++){
//                var component = this.options.filter_module_array[i].options.component;
                var components = this.options.filter_module_array[i].options.container.options.components;
                for(var iComp = 0; iComp<components.length; iComp++){
                    var modulename = components[iComp].getName();
                    if(modulename==component_name){
                        //var source = [{"value":"1234","label":"S3","selected":false},
                        //    {"value":"12345","label":"S4","selected":false}];
                        //components[iComp].setDomain(source);
                        var adapter = components[iComp].getAdapter();
                        if((adapter!=null)&&(typeof adapter!="undefined")){
                            //Update the domain passing the filter module
                            var filterModule = this.getValues();
                            components[iComp].refreshDomainByAdapter(filterModule);
                        }
                    }
                }
            }
        }
    }

    //Each element in the results array is {componentName : this.options.name, code : items[i].value, label: items[i].label};
    //By default getValues considers only the active tabs
    FC.prototype.getValues = function (components){
        var results = {};
        var resultsCount = 0;
        if((components!=null)&&(typeof components!= "undefined")&&(components.length>0)){
            if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
                for(var iComp=0; iComp<components.length; iComp++){
                    var componenName = components[iComp].name;

                    for(var i=0; i<this.options.filter_module_array.length; i++){
                        var activeTab = this.options.filter_module_array[i].options.container.options.activeTab;
                        var components = this.options.filter_module_array[i].options.container.options.components;
                        for(var jComp = 0; jComp<components.length; jComp++){
                            var component = components[jComp];
                            var modulename = component.getName();
                            // activeTab=="undefined" if there is one component for the container
                            if((componenName==modulename)&&((activeTab==null)||(typeof activeTab=="undefined")||(activeTab.length==0)||(activeTab==modulename))){
                                var values = component.getValues();
                                if(values!=null){
                                    results[component.getName()] = values;
                                    resultsCount++;
                                }
                            }
                        }
                    }
                }
            }
        }
        else{
            //Return the values for all the components
            if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
                    for(var i=0; i<this.options.filter_module_array.length; i++){
                        var activeTab = this.options.filter_module_array[i].options.container.options.activeTab;
                        var components = this.options.filter_module_array[i].options.container.options.components;
                        for(var jComp = 0; jComp<components.length; jComp++){
//                            var component = this.options.filter_module_array[i].options.component;
                            var component = components[jComp];
                            if((activeTab==null)||(typeof activeTab=="undefined")||(activeTab.length==0)||(activeTab==component.getName())) {
                                var values = component.getValues();
                                if(values!=null){
                                    results[component.getName()] = values;
                                    resultsCount++;
                                }
                            }
                        }
                    }
            }
        }
        return results;
    }

    //Each element in the results array is {componentName : this.options.name, code : items[i].value, label: items[i].label};
    //getAllValues considers ALL tabs, not only the active tab
    FC.prototype.getAllValues = function (components){
        var results = {};
        var resultsCount = 0;
        if((components!=null)&&(typeof components!= "undefined")&&(components.length>0)){
            if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
                for(var iComp=0; iComp<components.length; iComp++){
                    var componenName = components[iComp].name;

                    for(var i=0; i<this.options.filter_module_array.length; i++){
                        var components = this.options.filter_module_array[i].options.container.options.components;
                        for(var jComp = 0; jComp<components.length; jComp++){
                            var component = components[jComp];
                            var modulename = component.getName();
                            if(componenName==modulename){
                                var values = component.getValues();
                                if(values!=null){
                                    results[component.getName()] = values;
                                    resultsCount++;
                                }
                            }
                        }
                    }
                }
            }
        }
        else{
            //Return the values for all the components
            if((this.options.filter_module_array!=null)&&(typeof this.options.filter_module_array!="undefined")){
                for(var i=0; i<this.options.filter_module_array.length; i++){
                    var components = this.options.filter_module_array[i].options.container.options.components;
                    for(var jComp = 0; jComp<components.length; jComp++){
//                            var component = this.options.filter_module_array[i].options.component;
                        var component = components[jComp];
                        var values = component.getValues();
                        if(values!=null){
                            results[component.getName()] = values;
                            resultsCount++;
                        }
                    }
                }
            }
        }
        return results;
    }

    FC.prototype.layoutRender = function () {

        this.options.layout_render = new LayoutFactory().createLayoutRender({"layoutType" :this.options.current_layout});

        this.options.layout_render.render({"mainContent":this.options.mainContent, "MAIN_CONTAINER": this.options.html_ids.MAIN_CONTAINER, "ITEM_COMPONENT_CLASS_ID": this.options.class_ids.ITEM_COMPONENT});
    }

    FC.prototype.render = function () {

        //Event lister of the filter
        this.initEventListeners();
        //Event Listener of each components
        this.initComponentsEventListener();
        //Render the layout (Template or Layout)
        this.layoutRender();
        this.renderComponents();
    }

    return FC;

});