teacss.ui.panel = teacss.ui.Panel = teacss.ui.Control.extend("teacss.ui.Panel",{},{
    init : function(options) {
        this._super(teacss.jQuery.extend({
            'text-align':'left',
            items: []
        },options));
        this.element = teacss.jQuery("<div>")
            .css({
                display: 'inline-block',
                width: this.options.width,
                height: this.options.height,
                'text-align': this.options['text-align'],
                margin: this.options.margin
            })

        for (var i=0;i<this.options.items.length;i++) {
            var item = this.options.items[i];
            if (item instanceof teacss.ui.Control) {
                this.element.append(item.element);
                item.options.nested = true;
            } else {
                this.element.append(item);
            }
        }
    }
})