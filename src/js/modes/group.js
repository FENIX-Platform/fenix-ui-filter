define([
    'loglevel',
    'jquery',
    'underscore',
    '../../config/errors',
    '../../config/events',
    '../../config/config',
    '../../html/selector.hbs',
    '../../html/group.hbs',
    '../../nls/labels',
    './selector'
], function (log, $, _, ERR, EVT, C, templateSelector, templateGroup, i18nLabels, Selector) {

    'use strict';

    var s = {
        SWITCH: "input[data-role='switch'][name='disable-selector']",
        REMOVE_BTN: "[data-role='remove']",
        ADD_BTN: "[data-role='add']",
        GROUPS_CONTAINER: '[data-role="groups"]'
    };

    function Group(obj) {

        $.extend(true, this, C, {initial: obj || {}, $filterEl: $(obj.el)});

        this._initVariables();

        this._attach();

        this._render();

        return this;
    }

    /**
     * disposition
     * @return {Object}
     */
    Group.prototype.dispose = function () {

        this._unbindEventListeners();

        _.each(this.groups, _.bind(function (group) {

            _.each(group, function(sel, id) {

                if (sel && sel.instance && typeof sel.instance.dispose === "function") {
                    sel.instance.dispose();
                }

            });

        }, this));

        this._destroyDependencies();

        this.$el.remove();
    };

    /**
     * reset
     * @return {Object}
     */
    Group.prototype.printDefaultSelection = function () {

        _.each(this.groups, _.bind(function (group) {

            _.each(group, function(sel, id) {

                if (sel && sel.instance && typeof sel.instance.printDefaultSelection === "function") {
                    sel.instance.printDefaultSelection();
                }

            });

        }, this));
    };

    /**
     * reset
     * @return {Object}
     */
    Group.prototype.reset = function () {

        _.each(this.groups, _.bind(function (group) {

            _.each(group, function(sel, id) {

                if (sel && sel.instance && typeof sel.instance.reset === "function") {
                    sel.instance.reset();
                }

            });

        }, this));
    };

    /**
     * disposition
     * @return {Object}
     */
    Group.prototype.getValues = function (format) {

        var result = {
                values: {},
                labels: {},
                errors: {},
                valid: true
            }, v,
            values,
            errors = {},
            valid = {},
            labels = {};


        if (!this.incremental) {

            values = {};

            var key = Object.keys(this.groups)[0];

            _.each(this.groups[key], _.bind(function (selector, key) {

                var instance = selector.instance;

                if (instance) {
                    v = instance.getValues(format);
                    values[key] = v.values;
                    labels[key] = v.labels;
                    result.valid = result.valid && !!v.valid;
                    $.extend(true, result.errors, v.errors);

                } else {
                    log.warn(key + " skip language");
                }

            }, this));

        } else {
            values = [];

            _.each(this.groups, _.bind(function (group) {

                var obj = {};

                _.each(group, _.bind(function (selector) {

                    var instance = selector.instance;

                    if (instance) {

                        var values = instance.getValues();

                        obj[selector.id] = values.values.length === 1 ? values.values[0] : values.values;

                        labels[selector.id] = $.extend(true, labels[selector.id], values.labels);

                    }

                }, this));

                values.push(obj);

            }, this));

        }

        result.values = values;
        result.labels = labels;

        return result;
    };

    /**
     * set srouces
     * @return {Object}
     */
    Group.prototype.setSource = function (values) {

        console.log("TODO setSource()");
    };


    /**
     * set value
     * @return {Object}
     */
    Group.prototype.setValue = function (values) {

        if (!this.incremental) {

            _.each(this.groups, function (group) {

                _.each(group, function (selector) {

                    var id = selector.id;

                    if (values.hasOwnProperty(id)) {
                        selector.instance.setValue(values[id])
                    }

                });

            });

        } else {

            if (Array.isArray(values)) {

                _.each(values, _.bind(function (obj, index) {

                    var group = this.groups["group_" + (index + 1)];

                    if (group) {
                        _.each(obj, function (v, key) {

                            if (group[key] && group[key].instance) {
                                group[key].instance.setValue(v);
                            }
                        });

                    } else {
                        this._addGroup(obj);
                    }


                }, this));

            }
            else {
                log.warn("Group is incremental and values should be an array of object")
            }
        }

    };

    /**
     * unset value
     * @return {Object}
     */
    Group.prototype.unsetValue = function (values) {

        console.log("TODO unsetValue()");

    };

    /**
     * enable
     * @return {Object}
     */
    Group.prototype.enable = function (silent) {

        _.each(this.groups, _.bind(function (group) {

            _.each(group, _.bind(function (selector) {

                var instance = selector.instance;

                if (instance) {
                    instance.enable(true)
                }

            }, this));

        }, this));

        this.status.disabled = false;

        this.$el.find(s.SWITCH).prop("checked", true);

        this.$el.find(s.ADD_BTN).prop('disabled', false);

        if (!silent) {
            this._trigger(EVT.SELECTOR_ENABLED);
        }
    };

    /**
     * disable
     * @return {Object}
     */
    Group.prototype.disable = function (silent) {

        _.each(this.groups, _.bind(function (group) {

            _.each(group, _.bind(function (selector) {

                var instance = selector.instance;

                if (instance) {
                    instance.disable(true)
                }

            }, this));

        }, this));

        this.status.disabled = true;

        this.$el.find(s.SWITCH).prop("checked", false);

        this.$el.find(s.ADD_BTN).prop('disabled', true);

        if (!silent) {
            this._trigger(EVT.SELECTOR_DISABLED);
        }

    };

    /**
     * tag selector container
     * */
    Group.prototype.tagAsInvalid = function () {

        this.$el.find(".form-group").addClass("has-error");

    };

    /**
     * tag selector container
     * */
    Group.prototype.tagAsValid = function () {

        this.$el.find(".form-group").addClass("has-success");
    };


    /**
     * untag selector container
     * */
    Group.prototype.untag = function () {

        this.$el.find(".form-group").removeClass("has-error");
        this.$el.find(".form-group").removeClass("has-success");
    };

    Group.prototype._initVariables = function () {

        this.channels = {};

        this.id = this.initial.id;
        this.controller = this.initial.controller;
        this.template = this.initial.template;
        this.lang = this.initial.lang;

        this.environment = this.initial.environment;
        this.cache = this.initial.cache;
        this.plugins = this.initial.plugins;

        this.constraints = this.initial.constraints;

        this.groups = {};
        this._selectors = this.initial.selectors;

        this.incremental = !!this.initial.incremental;

        this.classNames = this.initial.classNames;

        if (!this.incremental) {
            this.initialAmount = 1;
        } else {
            this.initialAmount = !isNaN(this.initial.initialAmount) ? this.initial.initialAmount : 0;
        }
        this.amount = 0;

        this.status = {
            disable: false
        };

        this.dependeciesToDestory = [];

    };

    /**
     * get Group status
     * @return {Object}
     */
    Group.prototype.getStatus = function () {

        return this.status;
    };

    Group.prototype._attach = function () {

        this.$el = this._getGroupContainer(this.id);

        this._bindEventListeners();

    };

    Group.prototype._getGroupContainer = function (id) {

        var $cont = this.$filterEl.find('[data-group="' + id + '"]'),
            conf = this,
            model;

        if ($cont.length === 0) {
            log.warn("Impossible to find selector container: " + id);

            model = $.extend(true, {
                classNames: conf.classNames,
                id: id,
                incremental: this.incremental
            }, conf.template, i18nLabels[this.lang]);

            $cont = $(templateGroup(model));

            if (this.direction === "append") {
                this.$filterEl.append($cont);
            } else {
                this.$filterEl.prepend($cont);
            }

        }

        return $cont;
    };

    Group.prototype._createSelectorContainer = function (id) {
        log.info("Create container for selector: " + id);

        var conf = $.extend(true, {
                id: id,
                classNames: this.incremental ? "fx-group-item fx-boxed" : "fx-group-item",
                incremental: this.incremental,
                hideHeader: !this.incremental,
                hideRemoveButton: !this.incremental,
                hideSwitch: !this.incremental ? true : this.template.hideSwitch
            }, i18nLabels[this.lang]),
            $html;

        $html = $(templateSelector(conf));

        return $html;
    };

    Group.prototype._render = function () {

        this.ready = false;

        this.selectorsReady = 0; //used for "ready" event

        for (var i = 0; i < this.initialAmount; i++) {
            this._addGroup();
        }

        if (this.initialAmount === 0) {
            window.setTimeout(_.bind(function () {
                this._trigger(EVT.SELECTOR_READY, {id: this.id});
            }, this), 100);
        }
    };

    Group.prototype._addGroup = function (values) {

        // increase the group amount
        this.amount++;

        var groupName = "group_" + this.amount;

        //create new group
        this.groups[groupName] = {};

        //create group $el and cache it
        var $el;

        $el = this._createSelectorContainer(groupName);
        this.groups[groupName].$el = $el;

        this._bindSelectorEventListeners($el, groupName);

        this.$el.find(s.GROUPS_CONTAINER).prepend($el);

        _.each(this._selectors, _.bind(function (obj) {

            var model = $.extend(true, {
                id: obj.id,
                controller: this.controller,
                lang: this.lang,
                languages: this.languages,
                plugins: this.plugins,
                el: $el,
                values: values ? values[obj.id] : undefined,
                cache: this.cache,
                environment: this.environment,
                template: {
                    hideRemoveButton: true,
                    hideSwitch: true
                }
            }, obj);

            model.instance = new Selector(model);

            model.instance.on(EVT.SELECTOR_READY, _.bind(this._onSelectorReady, this, groupName));

            model.instance.on(EVT.SELECTOR_ENABLED, _.bind(this._onSelectorEnabled, this, groupName));

            model.instance.on(EVT.SELECTOR_SELECTED, _.bind(this._onSelectorSelected, this, groupName));

            this.groups[groupName][model.id] = model;

        }, this));

        this._initDependencies();

    };

    Group.prototype._initDependencies = function () {

        _.each(this.groups, _.bind(function (group, groupName) {

            _.each(group, _.bind(function (sel, id) {

                if (!sel.hasOwnProperty("dependencies")) {
                    return;
                }

                this._processSelectDependencies(sel.dependencies, id, groupName);

            }, this));

        }, this));

    };

    Group.prototype._processSelectDependencies = function (d, id, groupName) {

        var self = this;

        _.each(d, _.bind(function (dependencies, selectorId) {

            //Ensure dependencies is an array
            if (!Array.isArray(dependencies)) {
                dependencies = [dependencies];
            }

            var selectors = [selectorId];

            _.each(selectors, _.bind(function (s) {

                _.each(dependencies, _.bind(function (d) {

                    if (typeof d !== "object") {
                        log.warn(JSON.stringify(d) + " is not a valid dependency configuration");
                        return;
                    }

                    var toAdd = {
                        event: "dep_" + d.event + "_" + s + "_" + groupName,
                        callback: function (payload) {

                            var call = self["_dep_" + d.id];

                            if ($.isFunction(call)) {
                                call.call(self, payload, {src: s, target: id, group: groupName, args: d.args});
                            } else {

                                log.error("Impossible to find : " + "_dep_" + d.id);
                            }
                        }
                    };
                    this.dependeciesToDestory.push(toAdd);

                    this.on(toAdd.event, toAdd.callback, this);

                }, this));

            }, this));

        }, this));
    };

    Group.prototype._onSelectorSelected = function (groupName, payload) {

        if (payload) {
            this._trigger("dep_select_" + payload.id + "_" + groupName, payload);
        }

        this._trigger(EVT.SELECTOR_SELECTED, payload)
    };

    Group.prototype._onSelectorEnabled = function () {

        this.enable();
    };

    Group.prototype._onSelectorReady = function () {

        this.selectorsReady++;

        log.info("Ready event listened from group: " + this.id);

        if (this.selectorsReady === Object.keys(this._selectors).length) {
            this._onReady();
        }
    };

    Group.prototype._onReady = function () {

        log.info("Group is ready: " + this.id);

        this._trigger(EVT.SELECTOR_READY, {id: this.id});
    };

    Group.prototype._unbindEventListeners = function () {

        this.$el.find(s.SWITCH).off();

        this.$el.find(s.REMOVE_BTN).off();

        this.$el.find(s.ADD_BTN).off();
    };

    Group.prototype._bindEventListeners = function () {

        this.$el.find(s.SWITCH).on("click", _.bind(this._onSwitchClick, this));

        this.$el.find(s.REMOVE_BTN).on("click", _.bind(this._onRemoveClick, this));

        this.$el.find(s.ADD_BTN).on("click", _.bind(this._onAddClick, this));
    };

    Group.prototype._bindSelectorEventListeners = function ($el, group) {

        $el.find(s.SWITCH).on("click", _.bind(this._onSelectorSwitchClick, this, group));

        $el.find(s.REMOVE_BTN).on("click", _.bind(this._onSelectorRemoveClick, this, group));

    };

    Group.prototype._unbindSelectorEventListeners = function ($el) {

        $el.find(s.SWITCH).off();

        $el.find(s.REMOVE_BTN).off();

    };

    Group.prototype._onSelectorSwitchClick = function (g, evt) {

        var checked = $(evt.target).is(":checked"),
            group = this.groups[g];

        if (group) {
            _.each(group, _.bind(function (s) {

                var instance = s.instance;

                if (!instance) {
                    return;
                }

                if (!!checked) {
                    s.instance.enable();
                } else {
                    s.instance.disable();
                }
            }, this));
        }
    };

    Group.prototype._onSelectorRemoveClick = function (g) {

        var group = this.groups[g];

        if (group) {
            _.each(group, _.bind(function (s) {

                var instance = s.instance;

                if (!instance) {
                    return;
                }

                s.instance.dispose();
            }, this))
        }

        this._unbindSelectorEventListeners(this.groups[g].$el);

        this._destroyGroupDependencies(g);

        this.groups[g].$el.remove();

        delete this.groups[g];

    };

    Group.prototype._destroyDependencies = function () {

        _.each(this.groups, _.bind(function (group, name) {
            this._destroyGroupDependencies(name);
        }, this))
    };

    Group.prototype._destroyGroupDependencies = function (group) {

        _.each(this.dependeciesToDestory, _.bind(function (d) {

            if (d.event.endsWith(group)) {
                delete this.channels[d.event];
            }
        }, this));
    };

    Group.prototype._onSwitchClick = function (e) {

        var checked = $(e.target).is(":checked");

        if (!!checked) {
            this.enable();
        } else {
            this.disable();
        }

    };

    Group.prototype._onRemoveClick = function () {

        this.dispose();

        this._trigger(EVT.SELECTOR_REMOVED, {id: this.id});

    };

    Group.prototype._onAddClick = function () {

        //force to be enabled
        this.enable();

        this._addGroup();
    };

    Group.prototype._getEventName = function (evt) {
        return this.controller.id + evt;
    };

    //pub/sub

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Group.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    Group.prototype._trigger = function (channel) {

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

    return Group;

});