teacss.ui.eventTarget = teacss.ui.EventTarget = teacss.jQuery.Class.extend("teacss.ui.EventTarget",{},{
    init : function () {
        this.listeners = {};
    },
    bind : function (event,func,data) {
        var list = this.listeners[event] || (this.listeners[event] = []);
        list.push({func:func,data:data});
        return func;
    },
    trigger : function (event,data) {
        if (this.listeners[event]) {
            for (var i=0;i<this.listeners[event].length;i++) {
                var listener = this.listeners[event][i];
                listener.func.call(this,listener.data,data);
            }
        }
    },    
    unbind: function(type, listener){
        if (this.listeners[type] instanceof Array){
            var listeners = this.listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i].func === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
})