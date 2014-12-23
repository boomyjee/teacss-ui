teacss.ui.check = teacss.ui.Check = teacss.ui.Control.extend("teacss.ui.Check",{},{
    setValue: function (value) {
        this.value = value;
        this.input[0].checked = value;
        this.input.button("refresh");
        this.trigger('setValue');
    },
    init : function(options) {
        var me = this;
        var $ = teacss.jQuery;
        this._super($.extend({
            showCheckbox: true
        },options));
        this.value = options.value || false;

        this.element = teacss.jQuery("<label for='check_input'>")
            .css({
                display: (me.options.width=='100%') ? 'block' : 'inline-block',
                'vertical-align':'bottom',
                width: me.options.width=='100%' ? 'auto' : me.options.width,
                height: me.options.height,
                margin: me.options.margin
            })
            .append(
                me.options.label
            );
        

        me.checkbox = teacss.jQuery("<input type='checkbox' id='check_input'>");
        
        var cnt = this.Class.cnt = (this.Class.cnt || 0)+1;
        
        me.element.appendTo("body").attr("for","check_input_"+cnt);
        me.checkbox.appendTo("body").attr("id","check_input_"+cnt);
        
        me.checkbox.button({
            icons:this.options.icons
        });

        me.element.detach();
        
        if (me.options.showCheckbox) {
            me.checkbox.attr("class","")        
            me.element.find(".ui-button-text").prepend(me.checkbox,"&nbsp;");
        }

        me.input = me.checkbox
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