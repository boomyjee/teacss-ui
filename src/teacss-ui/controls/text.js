teacss.ui.text = teacss.ui.Control.extend({
    init: function (o) {
        o = $.extend({
            width: 100
        },o || {});
        
        this._super(o);
        this.element = $("<div>");
        this.element.css({
            width: o.width=='100%' ? 'auto' : o.width,
            height: o.height || 'auto',
            display: o.width=='100%' ? 'block' : 'inline-block',
            height: o.height,
            margin: o.margin
        });
        
        this.input = $("<input type='text'>").appendTo(this.element);
        this.input.css({
            width: '100%',
            height: o.height ? '100%' : 'auto',
            '-moz-box-sizing':'border-box',
            '-wekit-box-sizing':'border-box',
            margin: 0
        });
        var me = this;
        this.input.bind("keyup change",function(){
            me.trigger("change");
        });
    },
    getValue: function () {
        return this.input.val();
    },
    setValue: function (val) {
        return this.input.val(val);
    }
});

teacss.ui.textarea = teacss.ui.Control.extend({
    init: function (o) {
        o = $.extend({
            height: 200
        },o || {});
        
        this._super(o);
        this.element = $("<div>");
        this.element.css({
            width: o.width=='100%' ? 'auto' : o.width,
            display: o.width=='100%' ? 'block' : 'inline-block',
            height: o.height,
            margin: o.margin
        });
        
        this.input = $("<textarea>").appendTo(this.element);
        this.input.css({
            width: '100%',
            height: '100%',
            '-moz-box-sizing':'border-box',
            '-wekit-box-sizing':'border-box'
        });
        var me = this;
        this.input.bind("keyup change",function(){
            me.trigger("change");
        });
    },
    getValue: function () {
        return this.input.val();
    },
    setValue: function (val) {
        return this.input.val(val);
    }
});