(function($){
teacss.ui.button = teacss.ui.Button = teacss.ui.Control.extend("teacss.ui.Button",{},{
    init : function(options) {
        var me = this;
        this._super(teacss.jQuery.extend({text:true},options));
        this.element = teacss.jQuery("<button>")
            .html(me.options.label)
            .css({
                display: (me.options.width=='100%') ? 'block' : 'inline-block',
                'vertical-align':'bottom',
                width: me.options.width=='100%' ? 'auto' : me.options.width,
                height: me.options.height || 'auto',
                margin: me.options.margin
            })
            .button({
                icons:this.options.icons,
                text: me.options.text
            })
        if (options.click) this.element.click($.proxy(options.click,this));
    }
})
})(teacss.jQuery);