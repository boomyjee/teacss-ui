teacss.ui.select = teacss.ui.combo.extend({
    init: function (options) {
        var $ = teacss.jQuery;
        options = $.extend({
            buttonClass: 'icon-button centered',
            comboDirection: 'bottom',
            preview: true,
            selectedIndex: 0
        },options);
        if (options.items && options.items.constructor==Object) {
            var items = [];
            for (var key in options.items) {
                items.push({label:options.items[key],value:key});
            }
            options.items = items;
        }
        this._super(options);
    }
});