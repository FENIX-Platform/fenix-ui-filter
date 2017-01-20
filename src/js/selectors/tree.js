define([
    "jquery",
    "loglevel",
    'underscore',
    '../../config/errors',
    '../../config/events',
    '../../config/config',
    '../../nls/labels',
    '../../html/selectors/tree.hbs',
    '../../html/selectors/treeItem.hbs',
    "jstree"
], function ($, log, _, ERR, EVT, C, i18n, template, templateItem) {

    'use strict';

    var defaultOptions = {
        summaryRender: function (params) {
            return this._summaryRender(params);
        }
    }, s = {
        SELECTORS_CLASS: ".fx-selector",
        TREE_CONTAINER: "[data-role='tree']",
        FILTER_CONTAINER: "[data-role='filter']",
        CLEAR_ALL_CONTAINER: "[data-role='clear']",
        SELECT_ALL_CONTAINER: "[data-role='select']",
        SUMMARY_CONTAINER: "[data-role='summary']",
        AMOUNT_CONTAINER: "[data-role='amount']",
        TEMPLATE_TREE: "[data-tree-template]",
        TEMPLATE_SUMMARY_ITEM: "[data-summary-item]"
    };

    function Tree(o) {

        $.extend(true, this, defaultOptions, o, {$el: $(o.el)});

        this._renderTemplate();

        this._initVariables();

        this._renderTree();

        return this;
    }

    /**
     * getValues method
     * Mandatory method
     */
    Tree.prototype.getValues = function () {

        var result = {values: [], labels: {}};

        var instance = this.tree.jstree(true),
            selection = instance.get_selected();

        //remove empty selection
        if (Array.isArray(selection) && selection.length > 0) {

            result.values = selection;

            _.each(result.values, function (c) {
                result.labels[c] = instance.get_node(c).text;
            });
        }

        return result;

    };

    /**
     * Reset method
     * Mandatory method
     */
    Tree.prototype.reset = function () {

        this.printDefaultSelection();

        log.info("Selector reset successfully");
    };

    /**
     * printDefaultSelection
     * Mandatory method
     */
    Tree.prototype.printDefaultSelection = function () {

        this.printDefaultSelection();

        log.info("Selector printDefaultSelection successfully");
    };

    /**
     * Disposition method
     * Mandatory method
     */
    Tree.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * Enable selector
     * Mandatory method
     */
    Tree.prototype.enable = function () {

        var nodes,
            $container = this.$el;

        nodes = $container.find(s.TREE_CONTAINER).jstree(true).get_json(null, {flat: true});

        _.each(nodes, function (n) {
            $container.find(s.TREE_CONTAINER).jstree(true).enable_node(n);
        });

        //enable filter
        $container.find(s.CLEAR_ALL_CONTAINER).removeAttr("disabled");
        $container.find(s.SELECT_ALL_CONTAINER).removeAttr("disabled");

        //enable filter
        $container.find(s.FILTER_CONTAINER).removeAttr("disabled");

        this.status.disabled = false;

        log.info("Selector enabled : " + this.id);

    };

    /**
     * Disable selector
     * Mandatory method
     */
    Tree.prototype.disable = function () {

        var nodes,
            $container = this.$el;

        nodes = $container.find(s.TREE_CONTAINER).jstree(true).get_json(null, {flat: true});

        _.each(nodes, function (n) {
            $container.find(s.TREE_CONTAINER).jstree(true).disable_node(n);
        });

        //disable clear all btn
        $container.find(s.CLEAR_ALL_CONTAINER).attr("disabled", true);
        $container.find(s.SELECT_ALL_CONTAINER).attr("disabled", true);

        //disable filter
        $container.find(s.FILTER_CONTAINER).attr("disabled", true);

        this.status.disabled = true;

        log.info("Selector disabled : " + this.id);

    };

    /**
     * Return Tree internal status
     * return {Object} status
     */
    Tree.prototype.getStatus = function () {

        return this._getStatus();
    };

    /**
     * Set tree domain
     * return {Object} status
     */
    Tree.prototype.setDomain = function (data) {

        return this._setDomain(data);

    };

    /**
     * setSource method
     * Mandatory method
     */
    Tree.prototype.setSource = function ( source ) {

       var $container = this.$el,
           tree = $container.find(s.TREE_CONTAINER).jstree(true);

        source = _.map(source, function (d) {
            return {
                id: d.value || d.id,
                text: d.label || d.text
            }
        });

        tree.settings.core.data = source;
        tree.refresh(true);
        tree.redraw(true);

    };

    /**
     * Unset the given value.
     * return {null}
     */
    Tree.prototype.unsetValue = function (v) {

        if (this.status.disabled !== true) {
            log.info("Unset tree value: " + v);
            this.tree.jstree(true).deselect_node({id: v});
        } else {
            log.warn("Selector is disabled. Impossible to unset tree value: " + v);
        }

        this._updateSummary();

    };

    /**
     * Resets the selected items to the given value.
     * return {null}
     */
    Tree.prototype.setValue = function (v, silent) {
        log.info("Set tree value: " + v + ". Silent? " + silent);

        if (!Array.isArray(v)) {
            v = [v];
        }

        //clear current selection
        this.tree.jstree(true).deselect_all(true);

        _.each(v, _.bind(function (value) {
            this.tree.jstree(true).select_node({id: value}, silent);
        }, this));

    };

    Tree.prototype._renderTemplate = function () {

        var $el = this.$el.find(s.TREE_CONTAINER);

        if ($el.length === 0) {

            log.info("Injecting template for: " + this.id);

            this.$el.append(template($.extend(true, {}, i18n[this.lang.toLowerCase()], this, this.selector)));
        }

    };

    Tree.prototype._initVariables = function () {

        this.$summaryItems = $();

        //Update status
        this.status = {};

        this.status.disabled = this.selector.disabled;

        this.channels = {};

        this.lang = this.lang.toUpperCase();

    };

    Tree.prototype.printDefaultSelection = function () {

        return this._printDefaultSelection();

    };

    Tree.prototype._getStatus = function () {

        return this.status;

    };

    Tree.prototype._buildTreeModel = function (fxResource, parent) {

        var data = this._buildTreeModelFromCodelist(fxResource, parent) || [];

        //Merge static static data
        if (this.selector.source) {

            var staticData = this.selector.source;

            if (!Array.isArray(data)) {
                log.error(ERR.INVALID_DATA);

            } else {

                var convertedData = staticData.map(function (i) {
                    return {id: i.value, text: i.label, parent: i.parent || '#'};
                });

                data = _.uniq(_.union(data, convertedData), false, function (item) {
                    return item.id;
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

    Tree.prototype._buildTreeModelFromCodelist = function (fxResource, parent, cl) {

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
                    id: item.code,
                    text: item.title[selector.lang] || item.title["EN"],
                    parent: parent || '#'
                });


                if (Array.isArray(item.children) && item.children.length > 0) {
                    data = _.union(data, this._buildTreeModelFromCodelist(item.children, item.code, cl));
                }

            } else {

                log.warn("code [" + item.code + "] excluded from " + this.id);
            }

        }, this));

        return data;
    };

    Tree.prototype._bindEventListeners = function () {

        this.tree

        //Default selection
            .on('ready.jstree', _.bind(function (e, data) {

                this.printDefaultSelection();

                this.status.ready = true;

                //Always async
                this._trigger(EVT.SELECTOR_READY, {id: this.id});

            }, this))

            .on("select_node.jstree", _.bind(function () {
                this._updateSummary();
            }, this))

            .on("deselect_node.jstree", _.bind(function () {
                this._updateSummary();
            }, this))

            .on("changed.jstree ", _.bind(function (e, data) {

                if (!isNaN(this.selector.max) && data.selected.length > this.selector.max) {
                    data.instance.deselect_node(data.node);
                    log.warn("Max number of selectable item reached. Change 'selector.selector.max' config.");
                    return;
                }

                /* TODO uncomment after configuration
                 if (!data.instance.is_leaf(data.node)) {
                 data.instance.toggle_node(data.node);
                 data.instance.deselect_node(data.node, true);
                 return;
                 }*/

                if (this.status.ready === true) {

                    this._notifyTreeSelectionChange({
                        instance: data.instance,
                        id: this.id
                    });

                }

            }, this));
    };

    Tree.prototype._unbindEventListeners = function () {

        this.tree.off();
    };

    Tree.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyTree();

    };

    Tree.prototype._renderTree = function () {

        var config = this.selector,
            $container = this.$el,
            tree,
            self = this;

        tree = $container.find(s.TREE_CONTAINER).jstree($.extend(true, {}, {
            core: {
                multiple: true,
                check_callback: true,
                animation: 0,
                data: function (node, cb) {

                    if (node.id === "#") {
                        self._getRootItems(config, cb);
                    } else {
                        self._getChildrenItems(config, node, cb);
                    }

                },
                themes: {
                    icons: false,
                    stripes: true
                }
            },
            plugins: ['search', 'wholerow', 'checkbox', "unique"],
            search: {
                show_only_matches: true
            }
        }, config.config));

        this.tree = tree;

        this._bindEventListeners();

        initBtns($container, this.id);

        initFilter($container);

        function initFilter($container) {

            var to = false;
            $container.find(s.FILTER_CONTAINER).on("keyup", function () {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function () {
                    var v = $container.find(s.FILTER_CONTAINER).val().replace(/\s+$/, '');
                    $container.find(s.TREE_CONTAINER).jstree(true).search(v);
                }, 250);
            });

        }

        function initBtns($container, id) {

            $container.find(s.CLEAR_ALL_CONTAINER).on('click', function () {
                $container.find(s.TREE_CONTAINER).jstree("deselect_all", true);
                self._notifyTreeSelectionChange({
                    instance: self.tree.jstree(true),
                    id: id
                })
            });

            $container.find(s.SELECT_ALL_CONTAINER).on('click', function () {
                $container.find(s.TREE_CONTAINER).jstree("select_all", true);
                self._notifyTreeSelectionChange({
                    instance: self.tree.jstree(true),
                    id: id
                })
            });
        }

    };

    Tree.prototype._getRootItems = function (config, cb) {

        var data = this._getTreeModel(config);

        if (config.lazy === true) {
            _.each(data, function (item) {
                item.children = true;
            })
        }

        cb(data);
    };

    Tree.prototype._getChildrenItems = function (config, node, cb) {

        var self = this,
            body = $.extend(true, {}, this.cl, {
                levels: 2,
                codes: [node.id],
                initialized : true
            });

        this.controller.getExternalResource(body)
            .then(function (data) {
                var model = self._buildTreeModel(data[0].children || [], node.id);
                cb(model);
            });

    };

    Tree.prototype._getTreeModel = function (config) {

        var data = this._buildTreeModel(this.data);

        for (var i = config.to; i >= config.from; i--) {
            data.push({id: i.toString(), text: i.toString()});
        }

        return data;

    };

    Tree.prototype._notifyTreeSelectionChange = function (o) {

        var self = this,
            payload = [],
            selected = o.instance.get_selected();

        _.each(selected, function (sel) {
            var node = o.instance.get_node(sel),
                label = {};

            label[self.lang] = node.text;

            payload.push({value: node.id, label: label, parent: node.parent})
        });

        this._updateSummary();

        this._trigger(EVT.SELECTOR_SELECTED, $.extend({id: self.id }, self.getValues()) )

    };

    Tree.prototype._updateSummary = function () {

        var values = this.getValues(),
            model = [],
            self = this,
            instance = this.tree.jstree(true);

        _.each(values.labels, function (val, key) {
            var $summaryModel = $(self.summaryRender({value: key, label: val})),
                value;

            if ($summaryModel.length > 0) {
                value = "<span data-value='" + key + "'> " + $summaryModel[0].outerHTML + "</span>"
            }

            model.push(value);
        });
        //unbind click listener
        this.$summaryItems.each(function () {
            $(this).off();
        });

        this.$summaryItems = $(templateItem({values: model}));

        //bind click listener
        this.$summaryItems.each(function () {
            var $this = $(this);
            $this.on("click", function () {
                if (self.status.disabled !== true) {
                    instance.deselect_node($this.find("[data-value]").data("value"));
                    $this.remove();
                }
            });
        });

        this.$el.find(s.SUMMARY_CONTAINER).empty().append(this.$summaryItems);

    };

    Tree.prototype._summaryRender = function (item) {

        return "<span>" + item.label + "<span class='code-brk'>[" + item.value + "]</span></span>";

    };

    Tree.prototype._setDomain = function (opts) {
        log.info("set tree domain");
        log.info(opts);

        var data = opts.data,
            model = [],
            $container = this.$el,
            tree;

        _.each(data, function (item) {
            model.push(item);
            model.concat(item.children)
        });

        model = _.unique(model);

        if ($container.length > 0 && Array.isArray(model)) {

            tree = $container.find(s.TREE_CONTAINER).jstree(true);

            var treeData = this._buildTreeModel(model, null);

            this.setSource(treeData);

        } else {
            log.warn("Impossible to find container for: " + this.id);
        }
    };

    Tree.prototype._getEventName = function (evt) {

        return this.controller.id + evt;
    };

    Tree.prototype._printDefaultSelection = function () {

        var config = this.selector,
            tree = this.tree.jstree(true);

        //clear current selection
        tree.deselect_all(true);

        if (config.default && Array.isArray(config.default) && $.isFunction(tree.select_node) && $.isFunction(tree.deselect_all)) {

            _.each(config.default, function (k) {
                tree.select_node(k)
            });
        }

        this._updateSummary();

    };

    Tree.prototype._destroyTree = function () {

        var $container = this.$el;

        $container.find(s.TREE_CONTAINER).jstree("destroy");

        $container.find(s.FILTER_CONTAINER).off();

        $container.find(s.CLEAR_ALL_CONTAINER).off();

        $container.empty();

        log.info("Destroyed tree: " + this.id);
    };

    // dependency handler

    Tree.prototype._dep_parent = function (opts) {

        this.setDomain(opts);

    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Tree.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    Tree.prototype._trigger = function (channel) {

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

    return Tree;

});