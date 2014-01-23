teacss.ui.dialog = teacss.ui.Dialog = teacss.ui.panel.extend({
    init: function (o) {
        var $ = teacss.jQuery;
        this._super($.extend({
            margin:0,
            autoOpen: false,
            padding: ""
        },o));
        
        var me = this;
        this.element.css("display","");
        this.element.dialog($.extend({},this.options,{
            create: function(event, ui){
                $(this).parent().appendTo(teacss.ui.layer);
                $(this).parent().css("position","");
                if (me.options.create)
                    me.options.create.apply(this,arguments);
            },
            open: function(event, ui){
                $('.ui-widget-overlay').appendTo(teacss.ui.layer);
                if (me.options.open)
                    me.options.open.apply(this,arguments);
            },
            title: this.options.label
        }));
    },
    open: function () {
        this.element.dialog("open");
    },
    
    close: function () {
        this.element.dialog("close");
    },
    
    isOpen: function () {
        this.element.dialog("isOpen");
    }
})