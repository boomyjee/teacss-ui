teacss.ui.dialog = teacss.ui.Dialog = teacss.ui.panel.extend({
    init: function (o) {
        var $ = teacss.jQuery;
        this._super($.extend({
            margin:0,
            autoOpen: false
        },o));
        
        this.element.dialog($.extend({},this.options,{
            create: function(event, ui){
                $(this).parent().appendTo(teacss.ui.layer);
            },
            open: function(event, ui){
                $('.ui-widget-overlay').appendTo(teacss.ui.layer);
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