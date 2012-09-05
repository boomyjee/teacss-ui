teacss.ui.Control = teacss.ui.control = teacss.ui.eventTarget.extend("teacss.ui.Control",{
    events: new teacss.ui.eventTarget(),
    extendOptions: function (static,extra) {
        if (!extra) { extra = static; static = {}; }
        return this.extend(static,{
            init: function (options) {
                this._super(teacss.jQuery.extend({},extra,options));
            }
        });
    }
},{
    value: false,
    element: false,

    change: function (func) {
        if (func) this.bind('change',func); else this.trigger('change');
    },
    init: function (options) {
        this._super();
        options = options || {};
        this.options = teacss.jQuery.extend({
            width: 'auto',
            height: 'auto',
            margin: '0 5px 0 0',
            enabled: true
        },options);
        if (this.options.change) this.change(this.options.change);
        if (this.options.setValue) this.bind("setValue",this.options.setValue);
        this.setEnabled(this.options.enabled);
        teacss.ui.Control.events.trigger("init",this);
    },
    setEnabled : function(enabled) {
        this.enabled = enabled;
    },
    enable : function() { this.setEnabled(true) },
    disable: function() { this.setEnabled(false) },

    getValue : function() { return this.value; },
    setValue:  function(value) { this.value = value; this.trigger("setValue"); },
    
    visibility: function (f) {
        var control = this;
        var cb = function(){
            if (f.call(this))
                control.element.show();
            else
                control.element.hide();
        }
        setTimeout(function() {
            control.form.bind("change",cb);
            cb.call(control.form);
        },1);
        return this;
    }    
})