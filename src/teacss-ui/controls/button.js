(function($){
teacss.ui.button = teacss.ui.Button = teacss.ui.Control.extend("teacss.ui.Button",{},{
    init : function(options) {
        var me = this;
        this._super(options);
        this.element = teacss.jQuery("<button>")
            .html(options.label)
            .css({
                display: (me.options.width=='100%') ? 'block' : 'inline-block',
                'vertical-align':'bottom',
                width: me.options.width=='100%' ? 'auto' : me.options.width,
                margin: me.options.margin
            })
            .button({
                icons:this.options.icons
            })
        if (options.click) this.element.click($.proxy(options.click,this));
    }
})
})(teacss.jQuery);