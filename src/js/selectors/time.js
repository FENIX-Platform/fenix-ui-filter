define([
    "jquery",
    "loglevel",
    'underscore',
    'moment',
    '../../config/errors',
    '../../config/events',
    '../../config/config',
    '../../nls/labels',
    '../../html/selectors/time.hbs',
    'eonasdan-bootstrap-datetimepicker'

], function ($, log, _, Moment,  ERR, EVT, C, i18n, template ) {

    'use strict';

    var defaultOptions = {}, s = {
        PICKER_CONTAINER: "[data-selector-time]"
    };

    function Time(o) {

        var self = this;

        $.extend(true, this, defaultOptions, o, {$el : $(o.el)});

        this._checkConfiguration(); //empty

        this._renderTemplate();

        this._initVariables();

        this._renderSelector();

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
    Time.prototype.getValues = function () {

        var momentdate = this.$pickerEl.data("DateTimePicker").date(),
            //date = this.$pickerEl.data('date'),
            //date = new Date(this.$pickerEl.data('date')).getTime(),
            result = {
                values: [],
                labels: {}
            };

        if (momentdate != null && momentdate.isValid()) momentdate = momentdate.unix()*1000;

        //add always from
        result.values.push(momentdate);
        result.labels[momentdate] = "Date";


        return result;
    };

    /**
     * Reset method
     * Mandatory method
     */
    Time.prototype.reset = function () {

        this.printDefaultSelection();

        log.info("Selector reset successfully");

    };

    /**
     * Disposition method
     * Mandatory method
     */
    Time.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");
    };

    /**
     * Enable selector
     * Mandatory method
     */
    Time.prototype.enable = function () {

        this.status.disabled = false;

        this.$pickerEl.data("DateTimePicker").enable();

        log.info("Selector enabled : " + this.id);

    };

    /**
     * Disable selector
     * Mandatory method
     */
    Time.prototype.disable = function () {

        this.status.disabled = true;

        this.$pickerEl.data("DateTimePicker").disable();

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Time.prototype.getStatus = function () {

        return this._getStatus();
    };

    /**
     * Print print selection
     * return {Object} status
     */
    Time.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();
    };

    /**
     * Unset the given value.
     * return {null}
     */
    Time.prototype.unsetValue = function (v) {
        log.info("Unset tree value: " + v);

        if (this.status.disabled !== true) {
            log.warn("Value will not be unset because of the selector configuration");
        } else {
            log.warn("Selector is disabled. Impossible to unset time value: " + v);
        }

    };

    /**
     * Resets the selected items to the given value.
     * return {null}
     */
    Time.prototype.setValue = function (v, silent) {
        log.info("Set input value: " + v);

        this.silentMode = silent;

        var d = new Date(v).getTime();
        d = (isNaN(v)) ?  Moment(d).unix() : Moment(v,'x').unix();

        log.info("Moment Object: ", Moment(d,'X'));

        this.$pickerEl.data("DateTimePicker").date(Moment(d,'X'));
    };

    Time.prototype._checkConfiguration = function () {

    };

    Time.prototype._getStatus = function () {

        return this.status;
    };

    Time.prototype._renderTemplate = function () {

        var $el = this.$el.find(s.PICKER_CONTAINER);

        if ($el.length === 0) {

            log.info("Injecting template for: " + this.id);
            this.$el.append(template($.extend(true, {}, i18n[this.lang], this, this.selector)));
        }

    };

    Time.prototype._initVariables = function () {

        //Init status
        this.status = {};
        this.status.disabled = this.selector.disabled;

        this.values = [];

        this.channels = {};

        this.$pickerEl = this.$el.find(s.PICKER_CONTAINER);

    };

    Time.prototype._renderSelector = function () {

        this.$pickerEl.datetimepicker(
            $.extend(true, {
                icons: {
                    time: "icojam_time time-selector-icon",
                    date: "icojam_calendar_4 time-selector-icon",
                    up: "icojam_arrow_up time-selector-icon",
                    down: "icojam_arrow_down time-selector-icon"
                }
                ,locale: this.lang.toLowerCase()
            }, /*here*/ this.selector.config) //add calculated properties
        );

    };

    Time.prototype._printDefaultSelection = function () {

        var config = this.selector,
            defaultValue = config.default || [];

        this.setValue(defaultValue);

    };

    Time.prototype._getEventName = function (evt) {
        return this.controller.id + evt;
    };

    Time.prototype._bindEventListeners = function () {

        var self = this;

        this.$pickerEl.on("dp.change", _.bind(function () {

            if (this.status.ready === true) {

                //workaround for silent change
                if (this.silentMode !== true) {
                    this._trigger(EVT.SELECTOR_SELECTED, $.extend({id: self.id }, self.getValues()) )

                }
                delete this.silentMode;

            }

        }, this));

    };

    Time.prototype._unbindEventListeners = function () {
        this.$pickerEl.off();
    };

    Time.prototype._dispose = function () {

        this._unbindEventListeners();

        if (this.$pickerEl.data("DateTimePicker") && typeof this.$pickerEl.data("DateTimePicker").destroy === "function") {
            this.$pickerEl.data("DateTimePicker").destroy();
        }

        this.$el.empty();

    };

    // dependency handler

    Time.prototype._dep_ensure_unset = function (opts) {
        log.warn("_dep_ensure_unset method not implemented for time selector");
    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Time.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    Time.prototype._trigger = function (channel) {

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

    return Time;

});