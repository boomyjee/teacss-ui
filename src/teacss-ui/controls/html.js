teacss.ui.html = teacss.ui.Html = teacss.ui.HTML = teacss.ui.Control.extend("teacss.ui.Html",{},{
    init : function(options) {
        this._super(teacss.jQuery.extend({html:""},options));
        this.element = teacss.jQuery(this.options.html);
    }
});