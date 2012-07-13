teacss.ui.Mapper = jQuery.Class.extend({},{
    value: false,
    root: false,
    items: [],
    init: function (root,name) {
        this.root = root;
        root.options.name = "";
        this.register(root,true);
    },
    registerHook: function (func,that) {
        that = that || this;
        var items = [];
        var e = teacss.ui.Control.events.bind("init",function(data,item){  items.push(item); });
        func.call(that);
        teacss.ui.Control.events.unbind(e);
        for (var i=0;i<items.length;i++)
            this.register(items[i]);
    },
    register: function (item,root) {
        var me = this;
        var name = item.options.name;
        
        if (name!=undefined) {
            item.change(function(){ 
                if (this!=me.root || !this.root_change) me.changed(this); 
            });
            if (root)
                this.value = item.getValue();
            else
                item.setValue(me.prop(item.options.name));
            this.items.push(item);
        }
    },
    prop : function(path, value) {
        var layer = this;
        path = (path=="") ? "value" : "value."+path;
        return teacss.ui.prop(layer,path,value);
    },    
    changed : function (control) {
        var name = (control) ? control.options.name : "";
        var value = (control) ? control.getValue() : this.value;
        
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
        }
        if (control!=this.root) {
            this.root_change = true;
            this.root.change();
            this.root_change = false;
        }
    }
});