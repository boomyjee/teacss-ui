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
            appendTo: "#teacss-layer",
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
        return this.element.dialog("isOpen");
    }
})