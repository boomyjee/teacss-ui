teacss.jQuery.Class.extend("teacss.ui.Control",{
    setup : function (superclass) {
        var old_init = this.prototype.init;
        this.prototype.init = function (options) {
            if (this.control_processed) {
                old_init.apply(this,arguments);
                return;
            } else {
                this.control_processed = true;
                old_init.apply(this,arguments);
            }

            var ui = teacss.ui;
            var me = this;
            if (!ui.activeFieldset) return;
            options = options || {};
            var name = 'param'+ui.counter++;
            ui.activeForm.controls[name] = me;
            me.form = ui.activeForm;
            if (options.name!==undefined) {
                me.change(function(){ me.form.change(me);});
                me.setValue(me.form.prop(options.name));
            }
            if (options.formChange) {
                options.formChange.call(me,false,'',me.form.value);
            }
            ui.groups[ui.activeGroup].fieldsets[ui.activeFieldset].params[name] = me;
        }
    }
},{
    value: false,
    element: false,

    bind : function (event,func,data) {
        var list = this.listeners[event] || (this.listeners[event] = []);
        list.push({func:func,data:data});
    },
    trigger : function (event) {
        if (this.listeners[event]) {
            for (var i=0;i<this.listeners[event].length;i++) {
                var listener = this.listeners[event][i];
                listener.func.call(this,listener.data);
            }
        }
    },
    change: function (func) {
        if (func) this.bind('change',func); else this.trigger('change');
    },
    init: function (options) {
        this.listeners = {};
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
    },
    setEnabled : function(enabled) {
        this.enabled = enabled;
    },
    enable : function() { this.setEnabled(true) },
    disable: function() { this.setEnabled(false) },

    getValue : function() { return this.value; },
    setValue:  function(value) { this.value = value; this.trigger("setValue"); }
})