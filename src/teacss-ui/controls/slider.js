// TODO: Tick marks for slider
teacss.ui.slider = teacss.ui.Slider = teacss.ui.Control.extend("teacss.ui.Slider",{},{
    setValue: function (value) {
        this.value = value;
        this.element.slider("value",(value===undefined) ? this.options.min : Number(value));
    },
    init : function(options) {
        var me = this;
        this._super(teacss.jQuery.extend({
            min: 0,
            max: 100,
            step: 1,
            orientation: 'horizontal',
            height: false
        },options));
        this.value = (this.options.value===undefined) ? this.options.min : Number(this.options.value);

        this.element = teacss.jQuery("<div>")
            .css({
                display: (me.options.width=='auto') ? 'block' : 'inline-block',
                'vertical-align':'bottom',
                width: (me.options.orientation=='horizontal') ? me.options.width:'',
                height: (me.options.orientation=='vertical') ? me.options.height:'',
                margin: me.options.margin
            })
            .slider({
                min:me.options.min,
                max:me.options.max,
                step: me.options.step,
                value:me.value,
                orientation: me.options.orientation,
                slide: function(e,ui) {
                    me.value = ui.value;
                    me.trigger("change");
                },
                change:function(event,ui) {
                    me.value = teacss.jQuery(this).slider("value");
                    if (ui.originalEvent)
                        me.trigger("change");
                }
            })
    },
    setEnabled : function (enabled) {
        if (this.element)
            this.element.slider("option",{disabled:!enabled});
    }
})