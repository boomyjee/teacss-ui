teacss.ui.label = teacss.ui.Label = teacss.ui.Control.extend("teacss.ui.Label",{},{
    setValue: function (value) {
        this.value = value;
        this.update();
    },
    init : function(options) {
        this._super(teacss.jQuery.extend({
            'text-align':'left',
            template: "${value}"
        },options));
        this.element = teacss.jQuery("<div>")
            .addClass("ui-label")
            .css({
                display: this.options.width=='100%' ? 'block' : 'inline-block',
                width: this.options.width=='100%' ? 'auto' : this.options.width,
                height: this.options.height,
                margin: this.options.margin || 0,
                'text-align': this.options['text-align']
            })

        this.setValue(options.value);
    },
    update: function() {
        this.element.html( teacss.jQuery.tmpl(this.options.template,{value:this.value}) );
    },
    setEnabled: function (enabled) {
        if (this.element) {
            if (enabled)
                this.element.removeClass("ui-disabled");
            else
                this.element.addClass("ui-disabled");
        }
    }
})