(function (){
if (typeof teacss=="undefined")
    teacss = {functions:{}};
teacss.jQuery = teacss.functions.$ = jQuery.noConflict();
teacss.ui = teacss.functions.ui = {
    forms: {},
    groups: {},
    activeGroup: false,
    activeFieldset: false,
    activeForm: false,
    counter: 0,

    ref : function (data,value) {
        if (value && value.ref) value = teacss.ui.ref(data,this.prop(data,value.ref));
        else if (value && value.func) {
            var args = [];
            for (var i=0;i<value.args.length;i++) {
                args.push( this.ref(data,value.args[i]) );
            }
            var func = teacss.functions[value.func];
            value = func ? teacss.ui.ref(data,func.apply(this,args)) : false;
        }
        return value;
    },
    clone : function(o) {
        if(!o || "object" !== typeof o) return o;
        var c = "function" === typeof o.pop ? [] : {};
        var p, v;
        for(p in o) {
            if(o.hasOwnProperty(p)) {
                v = o[p];
                if(v && "object" === typeof v) c[p] = this.clone(v); else c[p] = v;
            }
        }
        return c;
    },
    prop : function (data,path,value) {
        var layer = data;
        var i = 0,path = path.split('.');
        for (; i < path.length; i++) {
            if (value != null && i + 1 === path.length)
                layer[path[i]] = this.clone(value);
            layer = layer[path[i]];
            if (layer==undefined) {
                //console.debug('error!',path);
                break;
            }
        }
        return layer;
    },
    group : function (title,name) {
        name = name || ("group"+this.counter++);
        if (!this.groups[name]) {
            this.groups[name] = {name:name,title:title,fieldsets:{}};
        }
        this.activeGroup = name;
        return name;
    },
    fieldset : function (title) {
        if (!this.activeGroup) { return; }
        var group = this.groups[this.activeGroup];
        var name = "fieldset"+this.counter++;
        group.fieldsets[name] = {title:title,params:{}};
        this.activeFieldset = name;
        return name;
    }
}
})();