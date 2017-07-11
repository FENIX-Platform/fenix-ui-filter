define([
    "jquery",
    "loglevel",
    'underscore',
    '../../config/errors',
    '../../config/events',
    '../../config/config',
    '../../html/selectors/dropdown.hbs',
    '../../nls/labels',
    'selectize'
], function ($, log, _, ERR, EVT, C, template, i18n) {

    'use strict';

    var defaultOptions = {
            selector: {
                hideSelectAllButton: true,
                hideClearAllButton: true,
                emptyOption: {
                    enabled: false,
                    text: "All",
                    value: "all"
                },
                sort: true,
                noElement: true
            }
        },
        s = {
            DROPDOWN_CONTAINER: "[data-role='dropdown']",
            CLEAR_ALL_CONTAINER: "[data-role='clear']",
            SELECT_ALL_CONTAINER: "[data-role='select']"
        };

    function Dropdown(o) {

        var self = this;

        $.extend(true, this, defaultOptions, o, {$el: $(o.el)});

        this._renderTemplate();

        this._initVariables();

        this._renderDropdown();

        this._bindEventListeners();

        //force async execution
        window.setTimeout(function () {

            self.status.ready = true;

            self._trigger(EVT.SELECTOR_READY, {id: self.id});

        }, 0);

        return this;
    }

    /**
     * getValues method
     * Mandatory method
     */
    Dropdown.prototype.getValues = function () {

        var result = {values: [], labels: {}},
            instance = this.dropdown[0].selectize,
            sel = instance.getValue() || [];

        if (!Array.isArray(sel)) {
            sel = sel.split(",");
        }

        _.each(sel, function (s) {

            result.values.push(s);

            //result.labels[s] = instance.getItem(s)[0].innerHTML.toString();
            result.labels[s] = $(instance.getItem(s)[0]).contents().get(0).nodeValue;

        });

        return result;

    };

    /**
     * getValues method
     * Mandatory method
     */
    Dropdown.prototype.setSource = function (source) {

        var data = _.map(source, function (d) {
            return {
                value: d.value,
                text: d.label
            }
        });

        this._updateDropdown(data);

    };

    /**
     * deselectAll method
     * Mandatory method
     */
    Dropdown.prototype.deselectAll = function (id) {
        console.log("in deselectAll dropdown")
        //TO DO
    };

    /**
     * Disposition method
     * Mandatory method
     */
    Dropdown.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * Reset method
     * Mandatory method
     */
    Dropdown.prototype.reset = function () {

        this.printDefaultSelection();

        log.info("Selector reset successfully");

    };

    /**
     * Enable selector
     * Mandatory method
     */
    Dropdown.prototype.enable = function () {

        var instance = this.dropdown[0].selectize;

        //print default values
        instance.enable();

        this.status.disabled = false;

        log.info("Selector enabled : " + this.id);
    };

    /**
     * Disable selector
     * Mandatory method
     */
    Dropdown.prototype.disable = function () {

        var instance = this.dropdown[0].selectize;

        //print default values
        instance.disable();

        this.status.disabled = true;

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Dropdown.prototype.getStatus = function () {

        return this._getStatus();
    };

    /**
     * Unset the given value
     * return {null}
     */
    Dropdown.prototype.unsetValue = function (v) {

        var value = v.toString();

        if (this.status.disabled !== true) {
            log.info("Unset dropdown value: " + v);

            //selectize doesn't have the unsetValue method
            //get current selection and remove 'value'
            var instance = this.dropdown[0].selectize,
                values = instance.getValue();

            if (!Array.isArray(values)) {
                values = values.split(",");
            }

            values = _.without(values, value);

            instance.setValue(values);
        } else {
            log.warn("Selector is disabled. Impossible to unset dropdown value: " + v);
        }

    };

    /**
     * Resets the selected items to the given value.
     * return {null}
     */
    Dropdown.prototype.setValue = function (v, silent) {
        log.info("Set dropdown value: " + JSON.stringify(v) + ". Silent? " + silent);

        var instance = this.dropdown[0].selectize;

        _.each(v, function (i) {
            //console.log(i)
            instance.addOption({value: i, text: i}, silent);
        });

        instance.setValue(v, silent);
    };

    Dropdown.prototype._getStatus = function () {

        return this.status;
    };

    Dropdown.prototype._renderTemplate = function () {

        var $el = this.$el.find(s.DROPDOWN_CONTAINER);

        if ($el.length === 0) {
            log.info("Injecting template for: " + this.id);
            this.$el.append(template($.extend(true, {}, i18n[this.lang.toLowerCase()], this, this.selector)));
        }

    };

    Dropdown.prototype._initVariables = function () {

        //Init status
        this.status = {};
        this.status.disabled = this.selector.disabled;

        this.$dropdownEl = this.$el.find(s.DROPDOWN_CONTAINER);

        this.lang = this.lang.toUpperCase();

        this.channels = {};

    };

    Dropdown.prototype._buildDropdownModel = function (fxResource) {

        var data = this._buildDropdownModelFromCodelist(fxResource) || [];

        //Merge static static data
        if (this.selector.source) {

            var staticData = this.selector.source;

            if (!Array.isArray(staticData)) {
                log.error(ERR.INVALID_DATA);

            } else {

                var convertedData = staticData.map(function (i) {
                    return {value: i.value.toString(), text: i.label, parent: '#'};
                });
                data = _.uniq(_.union(data, convertedData), false, function (item) {
                    return item.value.toString();
                });

            }
        }

        if (!!this.selector.sort) {
            data = data.sort(
                (typeof this.selector.sort === 'function') ? this.selector.sort : function (a, b) {
                    if (a.text < b.text) return -1;
                    if (a.text > b.text) return 1;
                    return 0;
                });
        }

        return data;
    };


    Dropdown.prototype._buildDropdownModelFromCodelist = function (fxResource, parent, cl) {

        var data = [],
            selector = this,
            selectorConfig = selector.selector || {},
            blacklist = selectorConfig.blacklist || [],
            bl = blacklist.map(function (item) {
                return item.toString()
            });

        _.each(fxResource, _.bind(function (item) {

            if (!_.contains(bl, item.code.toString())) {

                data.push({
                    value: item.code,
                    text: item.title[selector.lang] || item.title["EN"],
                    parent: parent || '#'
                });

                if (Array.isArray(item.children) && item.children.length > 0) {
                    data = _.union(data, this._buildDropdownModelFromCodelist(item.children, item.code, cl));
                }

            } else {

                log.warn("code [" + item.code + "] excluded from " + cl);
            }

        }, this));

        return data;
    };

    Dropdown.prototype._renderDropdown = function () {

        var config = $.extend(true, {}, this.selector),
            $container = this.$dropdownEl,
            selectize = $.extend(true, {}, config.config),
            dropdown,
            data,
            opt;

        data = this._buildDropdownModel(this.data);

        for (var i = config.to; i >= config.from; i--) {
            data.push({value: i.toString(), text: i.toString()});
        }

        // Add Empty Option
        if (config.emptyOption.enabled) {
            data.splice(0, 0, {value: config.emptyOption.value, text: config.emptyOption.text, parent: "#"});
        }

        opt = $.extend(true, {}, selectize, {
            options: data
        });

        dropdown = $container.selectize(opt);

        //cache data
        this.dropdownData = data;

        this.dropdown = dropdown;

        this.printDefaultSelection(data);

    };

    Dropdown.prototype.printDefaultSelection = function (data) {

        return this._printDefaultSelection(data);
    };

    Dropdown.prototype._printDefaultSelection = function (data) {

        var config = this.selector,
            instance = this.dropdown[0].selectize;

        if (config.default) {

            if (data) {
                //check for default value
                var found = _.find(data, function (option) {
                    return option.value.toString() === config.default[0].toString();
                });

                //print default values
                if (found){
                    this.setValue(config.default);
                } else if (config.emptyOption && config.emptyOption.value){
                    instance.setValue(config.emptyOption.value);
                }

            } else {
                //print default values
                this.setValue(config.default);
            }
        }

    };

    Dropdown.prototype._destroyDropdown = function () {

        var instance = this.dropdown[0].selectize;

        instance.destroy();

        log.info("Destroyed dropdown: " + this.id);
    };

    Dropdown.prototype._bindEventListeners = function () {

        var self = this,
            selectize = this.$dropdownEl[0].selectize;

        this.dropdown.on('change', function () {

            if (self.status.ready === true) {

                var data = self.getValues() || {},
                    values = data.values || [],
                    labels = data.labels || {},
                    result = [];

                _.each(values, function (s) {
                    result.push({
                        id: self.id,
                        value: s,
                        label: labels[s],
                        parent: "#"
                    });
                });

                self._trigger(EVT.SELECTOR_SELECTED, $.extend({id: self.id}, self.getValues()))

            }

        });

        //If the dropdown can not be without items
        //the last element will not be canceled
        if (!this.selector.noElement) {
            selectize.on('item_remove', function (item, elem) {

                var value = selectize.getValue();
                if((!value)&&(value.length==0)){
                    selectize.addItem(item);
                }
            });
        }

        /* In conflict, with ON CHANGE EVENT
         this.$el.find('.selectize-control').on('click', function () {
         if (self.status.ready === true) {
         self._trigger(EVT.SELECTOR_SELECTED, $.extend({id: self.id}, self.getValues()) )
         }
         });*/

        this.$el.find(s.CLEAR_ALL_CONTAINER).on("click", function () {
            if (selectize) {
                selectize.clear();
            }
        });

        this.$el.find(s.SELECT_ALL_CONTAINER).on("click", function () {

            if (selectize) {
                selectize.setValue(_.keys(selectize.options));
            }
        });

    };

    Dropdown.prototype._unbindEventListeners = function () {
        this.dropdown.off();

        this.$el.find(s.CLEAR_ALL_CONTAINER).off();
        this.$el.find(s.SELECT_ALL_CONTAINER).off();

    };

    Dropdown.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyDropdown();

        this.$el.empty();

    };

    Dropdown.prototype._getEventName = function (evt) {

        return this.controller.id + evt;
    };

    // dependency handler

    Dropdown.prototype._dep_min = function (opts) {

        var codes = opts.data && Array.isArray(opts.data.values) && opts.data.values.length > 0 ? opts.data.values : [{value: this.selector.from || 0}],
            from = codes[0],
            data = [];

        if (!this.selector.to) {
            log.error("Currently the '_dep_min' is implemented only for dropdown with static model [from/to]");
            return;
        }

        for (var i = this.selector.to; i >= from; i--) {
            data.push({
                value: i,
                text: i.toString()
            })
        }

        this._updateDropdown(data);

    };

    Dropdown.prototype._updateDropdown = function (data) {

        // Add Empty Option
        if (this.selector.emptyOption.enabled) {
            data.splice(0, 0, {
                value: this.selector.emptyOption.value,
                text: this.selector.emptyOption.text,
                parent: "#"
            });
        }

        var originalValue = this.getValues().values[0],
            instance = this.dropdown[0].selectize;

        //add new values to dropdown
        instance.clearOptions();
        instance.addOption(data);

        var newValues = _.map(data, function (d) {
                return isNaN(parseInt(d.value, 10)) ? d.value : parseInt(d.value, 10);
            }),
            from;

        from = _.min(newValues);

        //Set selected value
        var v = from > originalValue ? from : originalValue;

        if (v) {
            var found = _.find(data, function (option) {
                return option.value === v
            });

            if (found) {
                instance.setValue(v.toString());
            }
            else {
                this.printDefaultSelection(data);
            }
        } else {
            this.printDefaultSelection(data);
        }

    };

    Dropdown.prototype._dep_parent = function (opts) {

        var codelist = opts.data || [],
            data = this._buildDropdownModel(codelist);

        this._updateDropdown(data);

    };

    Dropdown.prototype._dep_process = function (opts) {

        var data = opts.data || [];

        // Add Empty Option
        // if(this.selector.config.emptyOption.enabled){
        // data.splice(0,0,{value:this.selector.emptyOption.value,  text:this.selector.emptyOption.text,  parent:"#"});
        // }

        this.setSource(data);

    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Dropdown.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    Dropdown.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    return Dropdown;

});