define([
    'loglevel',
    'jquery',
    'underscore',
    '../../config/errors',
    '../../config/events',
    '../../config/config',
    '../../html/selector.hbs',
    '../../html/nls.hbs',
    '../../nls/labels',
    "fenix-ui-bridge",
    'q',
    'validate.js'
], function (log, $, _, ERR, EVT, C, templateSelector, templateNls, i18nLabels, Bridge, Q, ValidateJs) {

    'use strict';

    var s = {
        SWITCH: "input[data-role='switch'][name='disable-selector']",
        REMOVE_BTN: "[data-role='remove']"
    };

    function Selector(obj) {

        $.extend(true, this, C, {initial: obj || {}, $filterEl: $(obj.el)});

        this._initVariables();

        this._render();

        return this;
    }

    /**
     * disposition
     * @return {Object}
     */
    Selector.prototype.printDefaultSelection = function () {

        _.each(this.selectors, _.bind(function (obj) {

            obj.instance.printDefaultSelection();

        }, this));

    };

    /**
     * disposition
     * @return {Object}
     */
    Selector.prototype.dispose = function () {

        this._unbindEventListeners();

        _.each(this.selectors, _.bind(function (obj) {

            obj.instance.dispose()

        }, this));

        this.$el.remove();
    };

    /**
     * reset
     * @return {Object}
     */
    Selector.prototype.reset = function () {

        _.each(this.selectors, _.bind(function (obj) {

            obj.instance.reset()

        }, this));
    };

    /**
     * disposition
     * @return {Object}
     */
    Selector.prototype.getValues = function (format) {

        var result = {
            values: {},
            labels: {},
            valid: true,
            errors: {}
        }, v, valid, values = {}, labels = {};

        if (this.nls) {

            if (!this.internalNls) {

                _.each(this.languages, _.bind(function (l) {

                    var selector = this.selectors[this.id + "_" + l],
                        instance;

                    if (selector) {

                        this.untag(selector.$el);

                        instance = selector.instance;
                        v = instance.getValues(format);
                        values[l] = v.values;
                        labels[l] = v.labels;

                        valid = this._validateSelection(v.values);

                        if (valid !== true) {
                            result.errors[this.id] = valid;
                            result.valid = false;
                            this.tagAsInvalid(selector.$el, valid);
                        } else {
                            this.tagAsValid(selector.$el);
                        }

                    } else {
                        log.warn(l + " skip language");
                    }

                }, this));
            }

            else {


                v = this.mainSelector.instance.getValues(format);
                values[this.lang.toUpperCase()] = v.values;
                labels[this.lang.toUpperCase()] = v.labels;

                valid = this._validateSelection(v.values);

                this.untag(this.mainSelector.$el);

                if (valid !== true) {
                    result.errors[this.id] = valid;
                    result.valid = false;
                    this.tagAsInvalid(this.mainSelector.$el, valid);
                } else {
                    this.tagAsValid(this.mainSelector.$el);
                }
            }

        }
        else {

            // console.log(this.mainSelector.instance); // << da valore nullo

            v = this.mainSelector.instance.getValues(format);
            values = v.values;
            labels = v.labels;

            this.untag(this.mainSelector.instance.$el);

            valid = this._validateSelection(v.values);

            if (valid !== true) {
                result.errors[this.mainSelector.id] = valid;
                result.valid = false;
                this.tagAsInvalid(this.mainSelector.instance.$el, valid);
            } else {
                this.tagAsValid(this.mainSelector.instance.$el);
            }

        }

        result.values = values;
        result.labels = labels;

        return result;
    };

    Selector.prototype._validateSelection = function (s) {

        var values = process(s);

        log.info("Selection constraints:");
        log.info(this.constraints);
        log.info("applied to:");
        log.info(values);

        return ValidateJs.single(values, this.constraints) || true;

        function process(v) {

            if (Array.isArray(v)) {
                return cleanArray(v).length === 1 ? cleanArray(v)[0] : cleanArray(v);
            }

            var cleaned = {};

            _.each(v, function (obj, key) {
                cleaned[key] = Array.isArray(obj) ? cleanArray(obj).length === 1 ? cleanArray(obj)[0] : cleanArray(obj) : cleanObject(obj);
            });

            return cleaned;

            function cleanArray(actual) {

                var newArray = [];
                for (var i = 0; i < actual.length; i++) {
                    if (actual[i] && actual[i] !== "") {

                        newArray.push(actual[i]);
                    }
                }
                return newArray;
            }

            function cleanObject(actual) {
                var newObj = {};
                _.each(actual, function (value, key) {
                    newObj[key] = cleanArray(value);
                });
                return newObj;
            }
        }

    };

    /**
     * set srouces
     * @return {Object}
     */
    Selector.prototype.setSource = function (values) {

        if (this.nls) {

            if (Array.isArray(values)) {

                _.each(this.selectors, _.bind(function (selector) {
                    if (selector && typeof selector.instance === "object") {
                        selector.instance.setSource(values);
                    }
                }, this))
            }

            if (typeof values === "object") {
                _.each(values, _.bind(function (v, lang) {
                    var selector = this.selectors[this.selectorId + "_" + lang];

                    if (selector && typeof selector.instance === "object") {
                        selector.instance.setSource(v);
                    }
                }, this))
            }


        } else {

            if (Array.isArray(values)) {
                this.mainSelector.instance.setSource(values);
            }

            if (typeof values === "object" && _.contains(Object.keys(values), this.lang.toUpperCase())) {
                this.mainSelector.instance.setSource(values[this.lang.toUpperCase()]);

            }
        }
    };

    /**
     * set value
     * @return {Object}
     */
    Selector.prototype.setValue = function (values) {

        if (this.nls) {

            if (Array.isArray(values)) {

                _.each(this.selectors, _.bind(function (selector) {
                    if (selector && typeof selector.instance === "object") {
                        selector.instance.setValue(values);
                    }
                }, this))
            }

            if (typeof values === "object") {
                _.each(values, _.bind(function (v, lang) {
                    var selector = this.selectors[this.selectorId + "_" + lang];

                    if (selector && typeof selector.instance === "object") {
                        selector.instance.setValue(v);
                    }
                }, this))
            }


        } else {

            if (Array.isArray(values)) {
                this.mainSelector.instance.setValue(values);
            }

            if (typeof values === "object" && _.contains(Object.keys(values), this.lang.toUpperCase())) {
                this.mainSelector.instance.setValue(values[this.lang.toUpperCase()]);

            }
        }
    };

    /**
     * set value
     * @return {Object}
     */
    Selector.prototype.enableReadOnly = function () {

        if (this.nls) {

            _.each(this.selectors, _.bind(function (selector) {
                if (selector && typeof selector.instance === "object") {
                    selector.instance.enableReadOnly();
                }
            }, this))


        } else {

            this.mainSelector.instance.enableReadOnly();
        }
    };

    /**
     * set value
     * @return {Object}
     */
    Selector.prototype.update = function (opts) {

        if (this.nls) {

            _.each(this.selectors, _.bind(function (selector) {
                if (selector && typeof selector.instance === "object") {
                    selector.instance.update(opts);
                }
            }, this))


        } else {

            this.mainSelector.instance.update(opts);
        }
    };

    /**
     * set value
     * @return {Object}
     */
    Selector.prototype.disableReadOnly = function () {

        if (this.nls) {

            _.each(this.selectors, _.bind(function (selector) {
                if (selector && typeof selector.instance === "object") {
                    selector.instance.disableReadOnly();
                }
            }, this))

        } else {

            this.mainSelector.instance.disableReadOnly();
        }
    };

    /**
     * unset value
     * @return {Object}
     */
    Selector.prototype.unsetValue = function (values) {

        if (this.nls) {

            if (Array.isArray(values)) {

                _.each(this.selectors, _.bind(function (selector) {
                    if (selector && typeof selector.instance === "object") {
                        selector.instance.unsetValue(values);
                    }
                }, this))
            }

            if (typeof values === "object") {
                _.each(values, _.bind(function (v, lang) {
                    var selector = this.selectors[this.selectorId + "_" + lang];

                    if (selector && typeof selector.instance === "object") {
                        selector.instance.unsetValue(v);
                    }
                }, this))
            }


        } else {

            if (Array.isArray(values)) {
                this.mainSelector.instance.unsetValue(values);
            }

            if (typeof values === "object" && _.contains(Object.keys(values), this.lang.toUpperCase())) {
                this.mainSelector.instance.unsetValue(values[this.lang.toUpperCase()]);

            }
        }
    };

    /**
     * get Selector status
     * @return {Object}
     */
    Selector.prototype.getStatus = function () {

        return this.mainSelector.instance.getStatus();
    };

    /**
     * enable
     * @return {Object}
     */
    Selector.prototype.enable = function (silent) {

        _.each(this.selectors, _.bind(function (obj) {
            obj.instance.enable(silent);
        }, this));

        this.$el.find(s.SWITCH).prop("checked", true);

        if (!silent) {
            this._trigger(EVT.SELECTOR_ENABLED, {id: this.id});
        }

    };

    /**
     * disable
     * @return {Object}
     */
    Selector.prototype.disable = function (silent) {

        _.each(this.selectors, _.bind(function (obj) {
            obj.instance.disable(silent)
        }, this));

        this.$el.find(s.SWITCH).prop("checked", false);

        if (!silent) {
            this._trigger(EVT.SELECTOR_DISABLED, {id: this.id});
        }

    };

    /**
     * mark selector container
     * */

    Selector.prototype._render = function () {

        this.ready = false;

        this.selectorsReady = 0; //used for "ready" event

        var externalResource = {};

        if (this.cl) {
            externalResource.obj = this.cl;
        }

        if (this.enumeration) {
            externalResource.obj = this.enumeration;
            externalResource.type = "enumeration";
        }

        if (this.distinct) {
            externalResource.obj = this.distinct;
            externalResource.type = "distinct";
        }

        this._createSelectors();

        this._attach();

        this._attachNls();

        this.getExternalResource(externalResource.obj, externalResource.type).then(_.bind(function (rawCl) {

            _.each(this.selectors, function (sel) {
                sel.data = rawCl;
            });

            _.each(this.selectors, _.bind(function (obj) {
                this._renderSelector(obj)
            }, this));

            this._activateCurrentLang();

            this._bindEventListeners();

        }, this), _.bind(this._onGetExternalResourceError, this));

    };

    /**
     * tag selector container
     * */
    Selector.prototype.tagAsInvalid = function (el, message) {

        var $el = el || this.$el,
            text = message.join(", ");

        $el.find(".form-group").addClass("has-error");
        $el.find(".help-block.error").html(ValidateJs.capitalize(text));

    };

    /**
     * tag selector container
     * */
    Selector.prototype.tagAsValid = function (el) {

        var $el = el || this.$el;
        $el.find(".help-block.error").empty();
    };

    /**
     * untag selector container
     * */
    Selector.prototype.untag = function (el) {
        var $el = el || this.$el;

        $el.find(".form-group").removeClass("has-error");
        $el.find(".help-block.error").empty();
    };

    Selector.prototype._activateCurrentLang = function () {

        this.$el.find('[data-lang="' + this.lang.toUpperCase() + '"]').tab('show');

        log.info("Lang shown: " + this.lang);
    };

    Selector.prototype._createSelectors = function () {

        var result = {};

        if (this.nls && !this.internalNls) {

            _.each(this.languages, _.bind(function (l) {

                result[this.id + "_" + l] = {
                    id: this.id + "_" + l,
                    controller: this.controller,
                    lang: this.lang,
                    template: this.template,
                    selector: this.selector
                };

            }, this));

        }
        else {

            result[this.id] = {
                id: this.id,
                controller: this.controller,
                lang: this.lang,
                template: this.template,
                selector: this.selector
            };

        }

        this.selectors = result;

        var key = Object.keys(this.selectors)[0];

        this.mainSelector = this.selectors[key];

        return result;
    };

    Selector.prototype._initVariables = function () {

        this.channels = {};

        this.selectorId = this.initial.selector.id;
        this.id = this.initial.id;
        this.controller = this.initial.controller;
        this.template = this.initial.template;
        this.selector = this.initial.selector;
        this.lang = this.initial.lang;
        this.cl = this.initial.cl;
        this.enumeration = this.initial.enumeration;
        this.distinct = this.initial.distinct;
        this.plugins = this.initial.plugins;
        this.environment = this.initial.environment;
        this.cache = this.initial.cache;
        this.values = this.initial.values;

        this.classNames = this.initial.classNames || "";

        this.constraints = this.initial.constraints;

        this.nls = !!this.initial.nls;
        this.internalNls = typeof this.initial.nls === "object" && this.initial.nls.gui === false;

        this.languages = this.nls ? this.initial.languages.map(function (l) {
            return l.toUpperCase();
        }) : [this.lang];

        this.cache_db = {};

        this.bridge = new Bridge({
            environment: this.environment,
            cache: this.cache
        });
    };

    Selector.prototype._renderSelector = function (obj) {

        var $container = this._getSelectorContainer(obj.id),
            $el = $container.find("[data-el]").length > 0 ? $container.find("[data-el]") : $container;

        var Plugin = this._getSelector(),
            model = $.extend(true, obj, {
                el: $el,
                controller: this,
                cl: this.cl,
                selector: {
                    default: this.values
                }
            });

        var instance = new Plugin(model);

        instance.on(EVT.SELECTOR_READY, _.bind(this._onSelectorReady, this));

        instance.on(EVT.SELECTOR_SELECTED, _.bind(this._onSelectorSelected, this));

        this.selectors[obj.id].instance = instance;

    };

    Selector.prototype._onSelectorSelected = function (payload) {

        this._trigger(EVT.SELECTOR_SELECTED, payload);
    };

    Selector.prototype._onSelectorReady = function () {

        this.selectorsReady++;

        log.info("Ready event listened from selector: " + this.id);

        if (this.selectorsReady === Object.keys(this.selectors).length) {

            this._onReady();
        }
    };

    Selector.prototype._onReady = function () {

        log.info("Selector is ready: " + this.id);

        this._trigger(EVT.SELECTOR_READY, {id: this.id});

    };

    Selector.prototype._getSelector = function () {

        return this.plugins[this.selectorId];
    };

    Selector.prototype._attach = function () {

        this.$el = this._getSelectorContainer(this.id);

    };

    Selector.prototype._getSelectorContainer = function (id) {

        var $cont = this.$filterEl.find('[data-selector="' + id + '"]'),
            conf = this;

        if ($cont.length === 0) {
            log.warn("Impossible to find selector container: " + id);

            $cont = $("<div data-selector='" + id + "'  class='" + (conf.classNames || '') + "'></div>");

            if (this.direction === "append") {
                this.$filterEl.append($cont);
            } else {
                this.$filterEl.prepend($cont);
            }

        } else {
            $cont.addClass(this.classNames);
        }

        if (conf.templateIsInitialized !== true) {
            conf.templateIsInitialized = true;
            $cont.append(this._createSelectorContainer(id));
        }

        return $cont;
    };

    Selector.prototype._createSelectorContainer = function (id) {
        log.info("Create container for selector: " + id);

        var classNames = "",
            obj = this.template,
            conf = $.extend(true, {id: id}, i18nLabels[this.lang], obj),
            $html;

        _.each(conf, function (value, key) {
            if (value === true) {
                classNames = classNames.concat(" " + key);
            }
        });

        $html = $(templateSelector($.extend(true, {}, conf)));

        return $html;
    };

    Selector.prototype._attachNls = function () {

        var model = {
            nls: this.nls,
            selector: this.id,
            lang: this.lang,
            languages: this.languages,
            id: this.controller.id,
            internalNls: this.internalNls
        };

        this.$el.append(templateNls(model));
    };

    Selector.prototype._unbindEventListeners = function () {

        this.$el.find(s.SWITCH).off();

        this.$el.find(s.REMOVE_BTN).off();
    };

    Selector.prototype._bindEventListeners = function () {

        this.$el.find(s.SWITCH).on("click", _.bind(this._onSwitchClick, this));

        this.$el.find(s.REMOVE_BTN).on("click", _.bind(this._onRemoveClick, this));
    };

    Selector.prototype._onSwitchClick = function (e) {

        var checked = $(e.target).is(":checked");

        if (!!checked) {
            this.enable();
        } else {
            this.disable();
        }

    };

    Selector.prototype._onRemoveClick = function () {

        this.dispose();

        this._trigger(EVT.SELECTOR_REMOVED, {id: this.id});

    };

    Selector.prototype._getEventName = function (evt) {
        return this.controller.id + evt;
    };

    // Preload scripts and external resources

    Selector.prototype.getExternalResource = function (obj, type) {

        if (!obj) {
            log.info("No external resource needed");
            return Q.Promise(function (resolve) {
                resolve();
            });
        }

        if (!obj.initialized && this.selector.lazy === true) {
            log.warn("Lazy loading for selector: " + this.id);
            obj.levels = 1;
            obj.level = 1;
        }

        delete obj.initialized;

        //Check if codelist is cached otherwise query
        var stored = this._getStoredCodelist(obj);

        if (stored === undefined || stored.length < 2) {

            log.info(this._getCodelistCacheKey(obj) + " not in session storage.");

            return this._createPromise(obj, type);

        } else {

            log.info(this._getCodelistCacheKey(obj) + " read from session storage.");

            return Q.Promise(function (resolve) {
                resolve(stored);
            });
        }
    };

    Selector.prototype._onGetExternalResourceError = function (e) {
        log.error("Resources load: error");
        log.error(e)
    };

    Selector.prototype._createPromise = function (obj, type) {

        var self = this,
            body = obj,
            key = this._getCodelistCacheKey(obj);

        return this._getPromise(body, type)
            .then(function (result) {

                var data = [];

                if (!Array.isArray(result)) {

                    _.each(result, function (obj, key) {
                        data.push({
                            code: key,
                            title: $.extend(true, {}, obj)
                        })
                    });

                } else {
                    data = result;
                }

                log.info("Code List loaded successfully for: " + key);

                self._storeCodelist(body, data);

                return data;

            }, function (r) {
                log.error(r);
            });
    };

    Selector.prototype._storeCodelist = function (obj, cl) {

        this.cache_db[this._getCodelistCacheKey(obj)] = cl;

        return this.cache_db[this._getCodelistCacheKey(obj)];
    };

    Selector.prototype._getStoredCodelist = function (obj) {

        return this.cache_db[this._getCodelistCacheKey(obj)];
    };

    Selector.prototype._getCodelistCacheKey = function (o) {

        var obj = typeof o === 'object' ? o : {},
            key = "_",
            keys = Object.keys(obj).sort();

        for (var i = 0; i < keys.length; i++) {
            key += "_" + keys[i] + ":" + obj[keys[i]];
        }

        return key;
    };

    Selector.prototype._getPromise = function (body, type) {

        var promise,
            t = type || "";
        switch (t.toLowerCase()) {

            case "enumeration" :
                promise = this.bridge.getEnumeration({
                    uid: body.uid
                });
                break;

            case "distinct" :
                promise = this.bridge.getColumnDistinctValues({
                    uid: body.uid,
                    version: body.version,
                    columnId: body.columnId
                });

                break;

            default :

                promise = this.bridge.getCodeList({
                    body: body
                });

                break;
        }

        return promise;

    };

    //pub/sub

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Selector.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    Selector.prototype._trigger = function (channel) {

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

    //dependencies
    Selector.prototype._dep_min = function (data) {

        _.each(this.selectors, function (selector) {
            selector.instance._dep_min(data);
        });
    };

    Selector.prototype._dep_parent = function (c) {

        this._getPromise(c).then(
            _.bind(function (data) {

                var source = [];

                _.each(data, function (s) {
                    source = source.concat(s.children);
                });

                source = _.uniq(source);

                _.each(this.selectors, function (selector) {
                    selector.instance._dep_parent({data: source});
                });

            }, this),
            function (r) {
                log.error(r);
            }
        )

    };

    Selector.prototype._dep_process = function (process) {

        var self = this;

        this.bridge.getProcessedResource(process).then(
            _.bind(function (result) {

                var data = Array.isArray(result.data) ? result.data : [],
                    source = [];

                _.each(data, function (s) {
                    source.push({
                        value: s[process.indexValueColumn || 0],
                        label: s[process.indexLabelColumn || 1]
                    });
                });

                source = _.uniq(source);

                _.each(self.selectors, function (selector) {
                    selector.instance._dep_process(source);
                });

            }, this),
            function (r) {
                log.error(r);
            }
        )
    };

    Selector.prototype._dep_ensure_unset = function (data) {

        _.each(this.selectors, function (selector) {
            selector.instance._dep_ensure_unset(data);
        });
    };

    Selector.prototype._dep_disable = function (data) {

        _.each(this.selectors, function (selector) {
            selector.instance._dep_disable(data);
        });
    };

    Selector.prototype._dep_readOnlyIfNotValue = function (payload, o) {
        log.info("_dep_readOnlyIfNotValue invokation");
        log.info(o);

        var forbiddenValue = o.args.value,
            selectedValues = payload.values || [],
            group = this.groups[o.group] || {},
            target = group[o.target] || {},
            instance = target.instance;

        if (instance) {
            if (_.contains(selectedValues, forbiddenValue)) {
                instance.disableReadOnly()
            } else {
                instance.enableReadOnly()
            }
        }
    };


    return Selector;

});