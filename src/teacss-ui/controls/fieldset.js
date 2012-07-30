teacss.ui.fieldset = teacss.ui.Fieldset = teacss.ui.Panel.extend({
    init: function (options) {
        this._super(options);
        this.element = teacss.jQuery("<fieldset>");
        if (this.options.label) {
            this.element.append(teacss.jQuery("<legend>").html(this.options.label));
        }
    }
}); 