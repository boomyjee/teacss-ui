teacss.ui.check = teacss.ui.Check = teacss.ui.Control.extend("teacss.ui.Check",{},{
    setValue: function (value) {
        this.value = value;
        this.input[0].checked = value;
        this.trigger('setValue');
    },
    init : function(options) {
        var me = this;
        this._super(options);
        this.value = options.value || false;

        this.element = teacss.jQuery("<label>")
            .css({
                display: (me.options.width=='100%') ? 'block' : 'inline-block',
                'vertical-align':'bottom',
                width: me.options.width=='100%' ? 'auto' : me.options.width,
                margin: me.options.margin
            })
            .append(
                teacss.jQuery("<input type='checkbox'>"),
                '&nbsp;',
                me.options.label
            )
            .button({
                icons:this.options.icons
            })

        me.input = this.element.find("input")
            .change(function(){
                me.value = this.checked;
                me.trigger("change");
            })
    },
    setEnabled : function (enabled) {
        if (this.element) {
            this.element[enabled ? 'removeClass':'addClass']('ui-state-disabled ui-disabled');
            this.element.find("input").prop('disabled',!enabled);
            this.element.data('button').options.disabled = !enabled;
        }
    }
})