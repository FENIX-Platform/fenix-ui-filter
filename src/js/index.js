/*global define, require*/
define([
    'jquery',
    'underscore',
    'loglevel',
    '../config/errors',
    '../config/events',
    '../config/config',
    '../html/summary.hbs',
    './modes/selector',
    './modes/group',
    '../nls/labels',
    "fenix-ui-converter",
    'handlebars',
    'bootstrap'
], function ($, _, log, ERR, EVT, C, templateSummary, Selector, Group, i18nLabels, Converter, Handlebars) {

    'use strict';

    var codePluginsFolder = "./selectors/",
        defaultOptions = {
            summaryRender: function (params) {
                return this._summaryRender(params);
            }
        },
        s = {
            SUMMARY_SELECTOR: "[data-code]",
            REMOVE_BTN: "[data-role='remove']"
        };

    function Filter(o) {
        log.info("FENIX filter");
        log.info(o);

        require("../css/fenix-ui-filter.css");

        $.extend(true, this, C, {initial: o}, defaultOptions);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._attach();

            this._initVariables();

            this._renderFilter();

            return this;

        } else {
            log.error("Impossible to create Filter!");
            log.error(valid)
        }
    }

    // API

    /**
     * Validate
     * @return {Object} validation result and errors
     */
    Filter.prototype.validate = function () {

        var values = this.getValues(),
            result = {
                valid: values.valid
            };

        if (values.errors) {
            result.errors = values.errors
        }

        return result
    };

    /**
     * Return the current selection
     * @return {Object} Selection
     */
    Filter.prototype.getValues = function (format, includedSelectors) {

        var candidate = format || this.outputFormat,
            call = this["_format_" + candidate];

        if ($.isFunction(call)) {
            return call.call(this, this._getValues(includedSelectors));
        } else {
            log.error("Impossible to find the output format: " + candidate);
        }
    };

    /**
     * Set filter selection
     * @return {null}
     */
    Filter.prototype.setValues = function (o, silent) {

        log.info("Set filter values. Silent? " + !!silent);
        log.info(o);

        return this._setValues(o, !!silent);
    };

    /**
     * Set selectors sources
     * @return {null}
     */
    Filter.prototype.setSources = function (o) {

        log.info("Set selectors sources");

        return this._setSources(o);
    };

    /**
     * unset selectors sources
     * @return {null}
     */
    Filter.prototype.unsetValues = function (o) {

        log.info("Unset selectors sources");

        return this._unsetValues(o);
    };

    /**
     * Reset the view content
     * @return {null}
     */
    Filter.prototype.reset = function () {

        this._destroyDependencies();

        _.each(this.selectors, _.bind(function (obj, name) {

            this._callSelectorInstanceMethod(name, 'reset');

        }, this));

        this._initDependencies();

        this._updateSummary();

        log.info("Filter reset");
    };

    /**
     * Print default selection of each selector
     * @return {null}
     */
    Filter.prototype.printDefaultSelection = function () {

        _.each(this.selectors, _.bind(function (obj, name) {

            this._callSelectorInstanceMethod(name, 'printDefaultSelection');

        }, this));

        log.info("Printed default selection");
    };

    /**
     * Add dynamically a selector
     * @return {null}
     */
    Filter.prototype.add = function (conf) {

        _.each(conf, _.bind(function (obj, name) {

            this._addSelector(name, obj);

        }, this));
    };

    /**
     * Remove dynamically a selector
     * @return {null}
     */
    Filter.prototype.remove = function (id) {

        var ids ;
        //force to be array
        if (!Array.isArray(id)) {
            ids = [id];
        } else {
            ids = id;
        }

        _.each(ids, _.bind(function (i) {
            this._removeSelector(i);
        }, this));

        this._updateSummary();

        this._trigger("remove", {id: ids[0]});

    };

    /**
     * Clear the filter from all selectors
     * @return {null}
     */
    Filter.prototype.clear = function () {

        _.each(this.selectors, _.bind(function (value, id) {
            this.remove(id);
        }, this));

        log.info("Filter " + this.id + " cleared successfully");

        return this;

    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Filter.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    // end API

    Filter.prototype._parseInput = function () {

        this._selectors = this.initial.selectors || {};
        this.$el = $(this.initial.el);
        this.template = this.initial.template;
        this.summary$el = this.initial.summaryEl;
        this.values = this.initial.values;
        this.cache = typeof this.initial.cache === "boolean" ? this.initial.cache : C.cache;

        if ($.isFunction(this.initial.summaryRender)) {
            this.summaryRender = this.initial.summaryRender;
        }

        this.direction = this.initial.direction || C.direction;
        this.ensureAtLeast = parseInt(this.initial.ensureAtLeast || C.ensureAtLeast, 10);

        this.common = this.initial.common || C.common;
        this.languages = this.initial.languages || C.languages;

        this.environment = this.initial.environment;
        this.lang = this.initial.lang || C.lang;
        this.lang = this.lang.toLowerCase();

        this.dependencies = this.initial.dependencies || {};

    };

    Filter.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //set filter id
        if (!this.id) {

            window.fx_filter_id >= 0 ? window.fx_filter_id++ : window.fx_filter_id = 0;
            this.id = String(window.fx_filter_id);
            log.info("Set filter id: " + this.id);
        }

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: ERR.MISSING_CONTAINER});
            log.warn("Impossible to find filter container");
        }

        //check for selectors
        if (!this._selectors) {
            log.warn("Imposerrors.length sible to find 'selectors' for filter: " + this.id);
            log.warn("Filer will wait for selectors dynamically");
        }

        //check if summary container exist
        if (this.summary$el) {

            this.summary$el = $(this.summary$el);

            if (this.summary$el.length === 0) {
                errors.push({code: ERR.MISSING_SUMMARY_CONTAINER});
                log.warn("Impossible to find summary container");
            }
        }

        return errors.length > 0 ? errors : valid;
    };

    Filter.prototype._attach = function () {

        this.$el.append(this.template);

    };

    Filter.prototype._initVariables = function () {

        this.selectors = {};
        this.selectorsId = [];
        this.selectorTypes = [];
        this.dependeciesToDestory = [];

        //validation
        this.constraints = {};

        //Summary
        this.hasSummary = (this.summary$el && this.summary$el.length) > 0;

        //pub/sub
        this.channels = {};

        //Process selectors
        _.each(this._selectors, _.bind(function (selectorConf, selectorId) {
            this._evaluateSelectorConfiguration(selectorConf, selectorId);
        }, this));

        //force to do not chunk codes
        return require(codePluginsFolder + this.corePlugins[0] + ".js");
    };

    Filter.prototype._evaluateSelectorConfiguration = function (obj, key) {

        if (this.selectors.hasOwnProperty(key)) {
            log.error("Duplication of selector id not allowed: " + key);
            return
        }

        obj.id = key;

        obj.mode = typeof obj.selectors === "object" ? "group" : "selector";

        this.selectors[key] = obj;

        if (obj.mode === "selector") {
            this._evaluateModeSelector(obj);
        }

        if (obj.mode === "group") {
            this._evaluateModeGroup(obj);
        }

        this.selectorsId = Object.keys(this.selectors);

    };

    Filter.prototype._evaluateModeSelector = function (obj) {

        if (obj.mode === "selector" && !obj.hasOwnProperty('selector')) {
            alert(obj.id + ": does not have a valid configuration. Missing 'selector'configuration ");
        }

        if (obj.selector && !obj.selector.hasOwnProperty('id')) {
            alert(obj.id + ": does not have a valid configuration. Missing 'selector.id' configuration.");
        }

        //Selector id
        var selectorType = obj.selector.id.toLowerCase();

        if (!_.contains(this.selectorTypes, selectorType)) {
            this.selectorTypes.push(selectorType);
        }

        if (obj.hasOwnProperty('constraints')) {
            var key = obj.parent ? obj.parent + "." + obj.id : obj.id;
            this.constraints[key] = obj.constraints;
        }

    };

    Filter.prototype._evaluateModeGroup = function (obj) {

        if (obj.mode === "group" && Object.keys(obj.selectors).length === 0) {
            alert(obj.id + ": is configured to be a group but not selectors are provided. Check the 'selectors' parameter");
        }

        _.each(obj.selectors, _.bind(function (s, key) {

            if (typeof s !== "object") {
                alert("Invalid selector configuration for: [" + key + "] of selector [" + obj.id + "]");
                return;
            }
            s.mode = "selector";
            s.id = key;
            s.parent = obj.id;
            this._evaluateModeSelector(s);
        }, this));

    };

    Filter.prototype._renderFilter = function () {

        this._renderSelectors();
    };

    Filter.prototype._renderSelectors = function () {
        log.info("Render selectors");

        this.ready = false;

        this.selectorsReady = 0; //used for "ready" event

        //In case there are selectors set timeout

        if (this.selectorsId.length > 0) {

            this.validTimeout = window.setTimeout(function () {

                //alert(ERR.READY_TIMEOUT);
                log.error(ERR.READY_TIMEOUT);

            }, C.validityTimeout);

        } else {

            log.warn("No selectors found for filter: " + this.id);

            //no selectors by default
            window.setTimeout(_.bind(function () {
                this._onReady();
            }, this), 100);
        }

        _.each(this.selectors, _.bind(function (obj, name) {
            this._renderSelector(obj, name);
        }, this));

    };

    Filter.prototype._renderSelector = function (obj, name) {
        log.info("Render selector: " + name);

        if (!obj.initialized) {

            obj.initialized = true;

            this._getSelectorRenders(obj, _.bind(function (Plugins) {

                var Mode = this._getMode(obj);

                var model = $.extend(true, {}, this.common, obj, {
                    id: name,
                    controller: this,
                    lang: this.lang,
                    languages: this.languages,
                    plugins: Plugins,
                    el: this.$el,
                    cache: this.cache,
                    environment: this.environment
                });

                var instance = new Mode(model);

                instance.on(EVT.SELECTOR_READY, _.bind(this._onSelectorReady, this));

                instance.on(EVT.SELECTOR_REMOVED, _.bind(this._onSelectorRemoved, this));

                instance.on(EVT.SELECTOR_DISABLED, _.bind(this._onSelectorChange, this));

                instance.on(EVT.SELECTOR_ENABLED, _.bind(this._onSelectorChange, this));

                instance.on(EVT.SELECTOR_SELECTED, _.bind(this._onSelectorSelected, this));

                this.selectors[name].instance = instance;

            }, this));

        }
        else {
            log.info(name + " selector is already initialized.");
            var status = this._callSelectorInstanceMethod(name, "getStatus");

            if (status.ready === true) {

                this._onSelectorReady();

            } else {
                log.warn(name + " selector was previously initialized but its inner status was not set to ready.");
            }
        }
    };

    Filter.prototype._onSelectorReady = function () {

        this.selectorsReady++;

        log.info("Ready event listened from filter: " + this.id);

        if (this.selectorsReady === this.selectorsId.length) {

            this._onReady();
        }
    };

    Filter.prototype._onReady = function () {

        this._initDependencies();

        this._checkSelectorsAmount();

        window.clearTimeout(this.validTimeout);

        // set default values
        if (!$.isEmptyObject(this.values)) {
            this.setValues(this.values, true);
        }

        this._disableDisabledSelectorsByDefault();

        this.ready = true;

        this._updateSummary();

        this._configureSelectorAfterDependency();

        log.info("~~~~ Filter [" + this.id + "] is ready");

        this._trigger('ready');

    };

    Filter.prototype._configureSelectorAfterDependency = function() {

        var self = this,
            values = this.getValues();

        _.each(this.events2selectors, function(selectors, event) {

            _.each(selectors, function(sel) {

                self._trigger("dep_" + event + "_" + sel, {
                    id : sel,
                    values : values.values[sel],
                    labels : values.labels[sel]
                });
            });
        });
    };

    Filter.prototype._disableDisabledSelectorsByDefault = function () {

        _.each(this.selectors, _.bind(function (s, name) {
            if (s.disabled === true) {
                this._callSelectorInstanceMethod(name, "disable");
            }
        }, this));
    };

    // dynamic selector add/remove

    Filter.prototype._lockRemoveButtons = function () {
        this.$el.find(s.REMOVE_BTN).attr("disabled", true);
    };

    Filter.prototype._unlockRemoveButtons = function () {
        this.$el.find(s.REMOVE_BTN).attr("disabled", false);
    };

    Filter.prototype._checkSelectorsAmount = function () {

        if (this.ensureAtLeast < 0) {
            return;
        }

        if (Object.keys(this._selectors).length <= this.ensureAtLeast) {
            this._lockRemoveButtons();
        } else {
            this._unlockRemoveButtons();
        }
    };

    // summary

    Filter.prototype._summaryRender = function (selector) {
        return selector.label + "<span class='code-brk'>[" + selector.code + "]</span>";
    };

    Filter.prototype._updateSummary = function () {

        if (!this.hasSummary) {
            return;
        }

        log.info("Update filter summary");

        var self = this,
            model = {summary: createSummaryModel(this.getValues())};

        //unbind click listener
        this.summary$el.find(s.SUMMARY_SELECTOR).each(function () {
            $(this).off();
        });

        this.summary$el.html(templateSummary(model));

        //bind click listener
        this.summary$el.find(s.SUMMARY_SELECTOR).each(function () {
            var $this = $(this);
            $this.on("click", function () {

                self._unsetSelectorValue({
                    code: $this.data("code"),
                    selector: $this.data("selector")
                });
            });
        });

        function createSummaryModel(data) {

            var values = data.values,
                labels = data.labels,
                result = [];

            try {

                _.each(values, _.bind(function (obj, name) {

                    if (Array.isArray(obj) && obj.length > 0) {

                        var model = this.selectors[name];

                        var s = {
                            label: model.template ? model.template.title : "",
                            id: name,
                            values: []
                        };

                        _.each(obj, _.bind(function (v) {

                            var code = typeof v === 'object' ? v.value : v,
                                selector = {
                                    code: code,
                                    label: labels[name][code],
                                    selector: name
                                };

                            selector.value = self.summaryRender(selector);

                            s.values.push(selector)

                        }, this));

                        result.push(s);
                    }
                }, self));

            } catch (e) {
                log.error(ERR.SUMMARY_MODEL_CREATION);
                log.error(e);
            }

            return result;

        }
    };

    Filter.prototype._unsetSelectorValue = function (obj) {

        this._callSelectorInstanceMethod(obj.selector, "unsetValue", obj.code);

    };

    Filter.prototype._removeSelectorReferences = function (id) {

        delete this.selectors[id];

        delete this._selectors[id];

        this.selectorsId = _.without(this.selectorsId, id);

    };

    // filter selection [values] and validation

    Filter.prototype._getValues = function (includedSelectors) {

        var result = {
            valid: true,
            labels: {},
            values: {},
            errors: {}
        };

        if (this.ready !== true) {
            log.warn("Abort getValues() because filter is not ready");
            return result;
        }

        _.each(this.selectors, _.bind(function (sel, key) {

            if (includedSelectors && !_.contains(includedSelectors, key)) {
                return;
            }

            var status = this._callSelectorInstanceMethod(key, "getStatus");

            if (!status.disabled) {

                var v = this._callSelectorInstanceMethod(key, "getValues");

                result.values[key] = v.values;
                result.labels[key] = v.labels;
                result.valid = result.valid && !!v.valid;

                $.extend(true, result.errors, v.errors);

            } else {
                log.warn("Disabled selector not included in result: " + key)
            }

        }, this));

        if (Object.keys(result.errors).length === 0) {
            delete result.errors;
        }

        return result;
    };

    Filter.prototype._setValues = function (o, silent) {

        var values = o.values || o;

        _.each(values, _.bind(function (obj, key) {

            if (this._getSelectorInstance(key)) {
                this._callSelectorInstanceMethod(key, "setValue", obj, silent);
            } else {
                log.info(key + " skipped");
            }

        }, this));

        this._configureSelectorAfterDependency();

        log.info("Filter values set");

    };

    Filter.prototype._setSources = function (o) {

        _.each(o, _.bind(function (obj, key) {

            if (this._getSelectorInstance(key)) {
                this._callSelectorInstanceMethod(key, "setSource", obj);
            } else {
                log.info(key + " skipped");
            }

        }, this));

        log.info("Selectors sources set");
    };

    Filter.prototype._unsetValues = function (o, silent) {

        var values = o.values || o;

        _.each(values, _.bind(function (obj, key) {

            if (this._getSelectorInstance(key)) {
                this._callSelectorInstanceMethod(key, "unsetValue", obj, silent);
            } else {
                log.info(key + " skipped");
            }

        }, this));

        log.info("Filter values unset");

    };

    Filter.prototype._getEnabledSelectors = function () {

        var result = [];

        _.each(this.selectors, _.bind(function (name) {

            var status = this._callSelectorInstanceMethod(name, "getStatus");

            if (!status.disabled === true) {
                result.push(name)
            }

        }, this));

        return result;
    };

    // dependencies fns

    Filter.prototype._initDependencies = function () {

        this.events2selectors = {};

        //register custom dependencies
        _.each(this.dependencies, _.bind(function (fn, id) {
            this["_dep_" + id] = fn;
        }, this));

        _.each(this.selectors, _.bind(function (sel, id) {

            if (!sel.hasOwnProperty("dependencies")) {
                return;
            }

            this._processSelectDependencies(sel.dependencies, id);

        }, this));

    };

    Filter.prototype._resolveDependencySelectors = function (id) {

        if (!id.startsWith("@")) {
            return [id]
        } else {

            id = id.substring(1);

            switch (id.toLowerCase()) {
                case "all":
                    return this.selectorsId;
                    break;
                default:
                    return id.split(",");
                    break;
            }
        }

    };

    Filter.prototype._processSelectDependencies = function (d, id) {

        var self = this;

        _.each(d, _.bind(function (dependencies, selectorId) {

            //Ensure dependencies is an array
            if (!Array.isArray(dependencies)) {
                dependencies = [dependencies];
            }

            var selectors = this._resolveDependencySelectors(selectorId);

            _.each(selectors, _.bind(function (s) {

                _.each(dependencies, _.bind(function (d) {

                    if (typeof d !== "object") {
                        log.warn(JSON.stringify(d) + " is not a valid dependency configuration");
                        return;
                    }

                    var toAdd = {
                        event: "dep_" + d.event + "_" + s,
                        callback: function (payload) {

                            var call = self["_dep_" + d.id];

                            if (d.args && d.args.payloadIncludes) {
                                var selectors = self._getModelValues(d.args.payloadIncludes);
                                payload = self.getValues(null, selectors)
                            }

                            if ($.isFunction(call)) {
                                call.call(self, payload, {src: s, target: id, args: d.args});
                            } else {
                                log.error("Impossible to find : " + "_dep_" + d.id);
                            }
                        }
                    };

                    if (!this.events2selectors[d.event]) {
                        this.events2selectors[d.event] = []
                    }

                    this.events2selectors[d.event].push(s);
                    this.events2selectors[d.event] = _.uniq(this.events2selectors[d.event]);

                    this.dependeciesToDestory.push(toAdd);

                    this.on(toAdd.event, toAdd.callback, this);

                }, this));

            }, this));

        }, this));
    };

    Filter.prototype._destroyDependencies = function () {

        _.each(this.dependeciesToDestory, _.bind(function (d) {
            delete this.channels[d.event];
        }, this));
    };

    Filter.prototype._dep_min = function (payload, o) {
        log.info("_dep_min invokation");
        log.info(payload);
        log.info(o);

        this._callSelectorInstanceMethod(o.target, "_dep_min", {data: payload});
    };

    Filter.prototype._dep_parent = function (payload, o) {

        var args = o.args || {},
            body = args.body || {},
            exclude = args.exclude || [];

        if (this.selectors[o.target]) {

            var c = this.selectors[o.target].cl;

            if (c) {

                log.info("_dep_parent invokation");
                log.info(o);

                //delete c.levels;
                //c.levels = 2;
                delete c.level;

                $.extend(true, c, body);

                c.codes = [];

                _.each(payload.values, function (value) {
                    if (!_.contains(exclude, value)) {
                        c.codes.push(value);
                    }
                });

                this._callSelectorInstanceMethod(o.target, "_dep_parent", c);
            }
        }
    };

    Filter.prototype._dep_process = function (payload, o) {

        if (this.selectors[o.target]) {

            var process = $.extend(true, {}, o.args);

            if (process) {

                log.info("_dep_process invokation");
                log.info(payload);
                log.info(o);

                if (!process.body) {
                    log.error("Impossible to find args.body for " + o.target + " `process` dependency configuration.");
                    return;
                }

                if (!process.uid) {
                    log.error("Impossible to find args.uid for " + o.target + " `process` dependency configuration.");
                    return;
                }

                var body = JSON.stringify(Array.isArray(process.body) ? process.body : [process.body]),
                    templ,
                    model = {};

                templ = Handlebars.compile(body);

                if (process.hasOwnProperty("payloadIncludes")) {

                    var selectors = _.without(this._getModelValues(process.payloadIncludes), o.target);
                    log.info("Selectors included in process: " + JSON.stringify(selectors));

                    var values = this.getValues(null, selectors) || {};

                    model = values.values;

                } else {

                    if (!Array.isArray(payload)) {
                        payload = [payload];
                    }
                    model[o.src] = payload;
                }

                _.each(model, function (values, key) {
                    model[key] = processArrayForHandlebars(values)
                });

                log.info("Model for the process:");
                log.info(model);

                process.body = JSON.parse(templ(model));

                //add lang
                if (!process.params) {
                    process.params = {};
                }
                process.params.language = this.lang;

                this._callSelectorInstanceMethod(o.target, "_dep_process", process);

            }
            else {
                log.warn("Impossible to find process.body configuration.")
            }
        }
        else {
            log.warn("Impossible to find _dep_process target selector: " + o.target);
        }

        function processArrayForHandlebars(values) {

            var result = values.map(function (p) {
                return typeof p === "object" ? p.value : p;
            });

            result = result.join('","');

            return result;
        }
    };

    Filter.prototype._dep_ensure_unset = function (payload, o) {
        log.info("_dep_ensure_unset invokation");
        log.info(o);

        if (this.selectors[o.target]) {

            this._callSelectorInstanceMethod(o.target, "_dep_ensure_unset", {
                value: this.selector2group[o.src],
                enabled: this._getEnabledSelectors()
            });
        }

    };

    Filter.prototype._dep_disable = function (payload, o) {
        log.info("_dep_disable invokation");
        log.info(o);

        if (this.selectors[o.target]) {
            if (!!payload.value) {
                this._callSelectorInstanceMethod(o.target, "enable");
            } else {
                this._callSelectorInstanceMethod(o.target, "disable");
            }
        }

    };

    Filter.prototype._dep_disableIfValue = function (payload, o) {
        log.info("_dep_disableIfValue invokation");
        log.info(o);

        var forbiddenValue = o.args.value,
            selectedValues = payload.values || [];

        if (_.contains(selectedValues, forbiddenValue)) {
            this._callSelectorInstanceMethod(o.target, "disable");
        } else {
            this._callSelectorInstanceMethod(o.target, "enable");
        }

    };

    Filter.prototype._dep_enableIfValue = function (payload, o) {
        log.info("_dep_enableIfValue invokation");
        log.info(o);

        var forbiddenValue = o.args.value,
            selectedValues = payload.values || [];

        if (_.contains(selectedValues, forbiddenValue)) {
            this._callSelectorInstanceMethod(o.target, "enable");
        } else {
            this._callSelectorInstanceMethod(o.target, "disable");
        }

    };

    Filter.prototype._dep_readOnlyIfNotValue = function (payload, o) {
        log.info("_dep_readOnlyIfNotValue invokation");
        log.info(o);

        var forbiddenValue = o.args.value,
            selectedValues = payload.values || [],
            selector = this.selectors[o.target] || {},
            instance = selector.instance;

        if (instance) {
            if (_.contains(selectedValues, forbiddenValue)) {
                instance.disableReadOnly()
            } else {
                instance.enableReadOnly()
            }
        }
    };

    Filter.prototype._getModelValues = function (ids) {

        if (!Array.isArray(ids)) {
            log.error("`args.payloadIncludes` configuration has to be an array");
            return {};
        }

        var selectedIds = [];

        _.each(ids, _.bind(function (id) {

            selectedIds = selectedIds.concat(this._resolveDependencySelectors(id));
        }, this));

        selectedIds = _.uniq(selectedIds);

        return selectedIds;
    };

    // Handlers

    Filter.prototype._onSelectorChange = function (values) {

        if (this.ready === true) {
            this._trigger('change', values);

            if (values) {
                //call dependencies
                this._trigger("dep_change_" + values.id, values);
            }

            this._updateSummary();
        }
    };

    Filter.prototype._onSelectorSelected = function (values) {

        if (this.ready === true) {

            this._trigger('select', values);

            if (values) {
                //call dependencies
                this._trigger("dep_select_" + values.id, values);
            }

            this._updateSummary();
        }

    };

    Filter.prototype._addSelector = function (name, obj) {

        this._evaluateSelectorConfiguration(obj, name);

        this._selectors[name] = obj;

        //destroy selectors dependencies
        this._destroyDependencies();

        this._renderFilter();

        this._checkSelectorsAmount();

    };

    Filter.prototype._onSelectorRemoved = function (obj) {

        if (obj) {

            this.remove(obj.id);

            this._trigger("dep_change_" + obj.id, obj);

            this._checkSelectorsAmount();

        }

    };

    Filter.prototype._removeSelector = function (id) {

        delete this._selectors[id];

        this._removeSelectorReferences(id);

    };

    // utils for selectors

    Filter.prototype._callSelectorInstanceMethod = function (name, method, opts1, opts2) {

        var Instance = this._getSelectorInstance(name);

        if (!Instance) {
            log.warn(name + " is not a current selector.");
            return
        }

        if ($.isFunction(Instance[method])) {
            return Instance[method](opts1, opts2);
        } else {
            log.error(name + " selector does not implement the mandatory " + method + "() fn");
        }

    };

    Filter.prototype._getSelectorRenders = function (obj, callback) {

        var ready = 0,
            result = {},
            plugins = [];

        if (obj.selector && obj.selector.id) {
            plugins.push(obj.selector.id);
        }

        if (obj.selectors) {
            _.each(obj.selectors, function (sel) {
                if (sel.selector && sel.selector.id) {
                    plugins.push(sel.selector.id);
                }
            });
        }

        plugins = _.unique(plugins);

        _.each(plugins, _.bind(function (p) {

            var path = this._getSelectorScriptPath(p);

            require([path + ".js"], function (Selector) {
                ready++;
                result[p] = Selector;

                if (ready === plugins.length) {
                    callback(result);
                }

            });

        }, this));

    };

    Filter.prototype._getMode = function (obj) {

        var instance;

        switch (obj.mode.toLowerCase()) {
            case "group" :
                instance = Group;
                break;
            default :
                instance = Selector;
        }

        log.info("Selector mode: " + obj.mode);

        return instance;

    };

    Filter.prototype._getSelectorInstance = function (name) {

        var selector = this.selectors[name];

        if (!selector) {
            log.warn("Impossible to find selector obj " + name);

            return;
        }

        var instance = selector.instance;

        if (!instance) {

            log.warn("Impossible to find selector instance for " + name);
        }

        return instance;
    };

    Filter.prototype._getSelectorScriptPath = function (name) {

        var corePlugins = this.corePlugins,
            registeredSelectors = $.extend(true, {}, this.pluginRegistry),
            path,
            conf,
            isCore;

        isCore = _.contains(corePlugins, name);

        if (isCore) {
            return codePluginsFolder + name;
        }

        conf = registeredSelectors[name];

        if (!conf) {
            log.error('Registration not found for "' + name + ' selector".');
        }

        if (conf.path) {
            path = conf.path;
        } else {
            log.error('Impossible to find path configuration for "' + name + ' tab".');
        }

        return path;
    };

    // pub/sub

    Filter.prototype._trigger = function (channel) {

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

    //disposition

    Filter.prototype.dispose = function () {

        //dispose selectors
        _.each(this.selectors, _.bind(function (obj, name) {
            this._callSelectorInstanceMethod(name, "dispose")
        }, this));

        //remove filter container
        this.$el.remove();

        if (this.hasSummary) {
            this.summary$el.remove();
        }

    };

    //Output formats

    Filter.prototype._format_plain = function (values) {
        return values;
    };

    Filter.prototype._format_fenix = function (values) {

        if (!!values.valid === false) {
            return values
        } else {
            return Converter.toD3P(this._selectors, values);
        }
    };

    Filter.prototype._format_catalog = function (values) {

        if (!!values.valid === false) {
            return values
        } else {
            return Converter.toFilter(this._selectors, values);
        }

    };

    return Filter;
});