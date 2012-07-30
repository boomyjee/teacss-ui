teacss.ui.form = teacss.ui.Form = teacss.ui.eventTarget.extend({
    init: function (f) {
        this._super();
        
        this.items = [];
        var me = this;
        var e = teacss.ui.Control.events.bind("init",function(data,item){  me.items.push(item); });
        f.call(this);
        teacss.ui.Control.events.unbind(e);
        
        for (var i=0;i<this.items.length;i++) {
            var item = this.items[i];
            item.form = me;
            if (item.options.name!==undefined) {
                item.change(function(){ me.itemChanged(this); });
                item.setValue(me.prop(item.options.name));
            }
            if (item.options.formChange) {
                item.options.formChange.call(item,false,'',me.value);
            }
        }        
    },
    
    prop : function(path, value) {
        var layer = this;
        path = (path=="") ? "value" : "value."+path;
        return teacss.ui.prop(layer,path,value);
    },
    
    setValue: function (value) {
        this.itemChanged(false,false,value);
    },
    
    getValue: function () {
        return this.value;
    },
    
    itemChanged : function (control,name,value,silent) {
        if (!name) {
            name = (control) ? control.options.name : "";
            value = (control) ? control.getValue() : value;
        }

        this.prop(name,value);
        for (var i=0;i<this.items.length;i++) {
            var ctl = this.items[i];
            var ctl_name = ctl.options.name;
            
            if (ctl!=control && ctl.options.name!=undefined) {
                if (name=="" || ctl.options.name==""
                        || (ctl.options.name && ctl.options.name.indexOf(name)==0)
                        || (ctl.options.name && name.indexOf(ctl.options.name)==0)
                ) {
                    var val = this.prop(ctl.options.name);
                    ctl.setValue(val);
                    if (!control) this.prop(ctl.options.name,ctl.getValue());
                }
            }
            if (ctl!=control && ctl.options.formChange) ctl.options.formChange.call(ctl,control,name,value);
        }
        this.trigger("change",{control:control,name:name,value:value,silent:silent});
    }
});