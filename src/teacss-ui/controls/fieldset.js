teacss.ui.fieldset = teacss.ui.Fieldset = teacss.ui.Panel.extend({
    init: function (options) {
        if (typeof(options)=='string') options = {label:options};
        this._super(teacss.jQuery.extend({elementTag:"fieldset"},options));
        this.element.attr("style",false);
        if (this.options.label) {
            this.element.append(teacss.jQuery("<legend>").html(this.options.label));
        }
    },
    push: function (what) {
        if (arguments.length==1 && what instanceof teacss.ui.Control) {
            var wrap = $("<div>")
                .css({
                    display: 'inline-block',
                    width: what.options.width || '100%',
                    verticalAlign: 'bottom'
                });
            
            wrap.append(what.element);
            what.element.css({
                display: 'block',
                width: 'auto'
            });
            
            this.element.append(wrap);
        } 
        else {
            teacss.ui.panel.prototype.push.apply(this,arguments);
        }
        return this;
    }    
}); 