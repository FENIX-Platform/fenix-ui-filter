define([
    "jquery",
    "loglevel",
    'underscore',
    '../../html/selectors/textarea.hbs',
    '../../config/errors',
    '../../config/events',
    '../../config/config'
], function ($, log, _, template, ERR, EVT, C) {

    'use strict';

    var s = {
            TEXTAREA: "[data-textarea]"
        };

    function Textarea(o) {

        var self = this;

        $.extend(true, this, o, {$el : $(o.el)});

        this.renderTaxtarea();

        this._initVariables();

        this._bindEventListeners();

        this.printDefaultSelection();

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
    Textarea.prototype.getValues = function () {

        var val = this.$textarea.val(),
            result = {
                values: [val],
                labels: { }
            };

            result.labels[val] = val;

        return result;

    };

    /**
     * Enable selector
     * Mandatory method
     */
    Textarea.prototype.enableReadOnly = function () {

        this.$textarea.attr('readonly', true);

        log.info("Selector read only enabled : " + this.id);

    };

    /**
     * Enable selector
     * Mandatory method
     */
    Textarea.prototype.disableReadOnly = function () {

        this.$textarea.attr('readonly', false);

        log.info("Selector read only disabled : " + this.id);

    };

    /**
     * Reset method
     * Mandatory method
     */
    Textarea.prototype.reset = function () {

        this.printDefaultSelection();

        log.info("Selector reset successfully");

    };

    /**
     * Disposition method
     * Mandatory method
     */
    Textarea.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * Enable selector
     * Mandatory method
     */
    Textarea.prototype.enable = function () {

        this.$textarea.attr('disabled', false);

        this.status.disabled = false;

        log.info("Selector enabled : " + this.id);

    };

    /**
     * Disable selector
     * Mandatory method
     */
    Textarea.prototype.disable = function () {

        this.$textarea.attr('disabled', true);

        this.status.disabled = true;

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Textarea.prototype.getStatus = function () {

        return this._getStatus();
    };

    /**
     * Print print selection
     * return {Object} status
     */
    Textarea.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();
    };

    /**
     * Unset the given value.
     * return {null}
     */
    Textarea.prototype.unsetValue = function (v) {
        log.info("Unset input value: " + v);

        if (this.status.disabled !== true) {
            log.warn("Value will not be unset because of the selector configuration");
        } else {
            log.warn("Selector is disabled. Impossible to unset input value: " + v);
        }

    };

    /**
     * Resets the selected items to the given value.
     * return {null}
     */
    Textarea.prototype.setValue = function (v, silent) {
        log.info("Set textarea value: " + v);

        this.$textarea.val(v);

        if (silent !== true) {
            this.$textarea.trigger("change");
        }

    };

    Textarea.prototype._getStatus = function () {

        return this.status;
    };

    Textarea.prototype._initVariables = function () {

        //Init status
        this.status = {};
        this.status.disabled = this.selector.disabled;

        this.channels = {};

    };

    Textarea.prototype.renderTaxtarea = function () {

        this._createTextarea();
    };

    Textarea.prototype._createTextarea = function () {

        var data = this.selector.source || [],
            config = this.selector.config || {},
            model = data.length > 0 ? data[0] : {},
            source;

        if (data.length > 0) {
            log.warn("Textarea source: considering only the first element.");
        }

        source = $.extend(true, {
            label :model.label,
            id : this.id
        }, config);

        this.$el.append(template(source));

        this.$textarea = this.$el.find(s.TEXTAREA);

    };

    Textarea.prototype._printDefaultSelection = function () {

        var config = this.selector,
            defaultValue = config.default || [];

        this.setValue(defaultValue);

    };

    Textarea.prototype._getEventName = function (evt) {

        return this.controller.id + evt;
    };

    Textarea.prototype._destroyTextarea = function () {

        log.info("Destroyed textarea: " + this.id);
    };

    Textarea.prototype._bindEventListeners = function () {

        var self = this;

        this.$textarea.on('change input', function () {

            if (self.status.ready === true) {

                var r = self.getValues(),
                    value = r.values[0] || "",
                    label = r.labels[value],
                    payload = {
                        id : self.id,
                        value: value,
                        label: label,
                        parent: null
                    };

                self._trigger(EVT.SELECTOR_SELECTED, payload )
            }
        });

    };

    Textarea.prototype._unbindEventListeners = function () {
        this.$textarea.off();
    };

    Textarea.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyTextarea();

        this.$el.empty();

    };

    // dependency handler

    Textarea.prototype._dep_ensure_unset = function (opts) {

        var disabled = opts.value,
            enabled = opts.enabled,
            currentValue = this.getValues().values[0],
            candidate;

        if (disabled == currentValue) {

            for (var i = 0; i < enabled.length; i++) {
                if (_.contains(this.values, enabled[i])) {
                    candidate = enabled[i];
                    break;
                }
            }

            if (!candidate) {
                this.printDefaultSelection();
            } else {
                this.setValue(candidate);
            }

        }
    };


    /**
     * pub/sub
     * @return {Object} component instance
     */
    Textarea.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    Textarea.prototype._trigger = function (channel) {

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

    return Textarea;

});