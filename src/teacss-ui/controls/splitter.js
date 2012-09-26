teacss.ui.splitter = teacss.ui.Splitter = (function($){
    return teacss.ui.Control.extend("teacss.ui.Splitter",{},{
        init : function (options) {
            var me = this;
            this._super($.extend({
                value: 300,
                align: 'left',
                size: 3
            },options));
            
            this.element = $("<div>")
                .addClass("ui-splitter")
                .css({
                    position:"absolute",
                    background: "#aaa",
                    cursor: (this.options.align=='left' || this.options.align=='right') ? "e-resize" : "n-resize"
                })
                .draggable({
                    axis: (this.options.align=='left' || this.options.align=='right') ? "x" : "y",
                    containment: "parent",
                    start: function () {
                        me.element.css({zIndex:1000000});
                    },
                    stop: function (e,ui) {
                        me.element.css({left:"",right:"",top:"",bottom:"",zIndex:""});
                        if (me.options.align=='left')
                            me.setValue(ui.position.left); else
                        if (me.options.align=='right')
                            me.setValue(ui.helper.parent().width() - ui.position.left); else
                        if (me.options.align=='top')
                            me.setValue(ui.position.top); else
                        if (me.options.align=='bottom')
                            me.setValue(ui.helper.parent().height() - ui.position.top);
                        me.trigger("change");
                    },
                    iframeFix: true
                })
          
            this.setValue(this.options.value);
            this.options.panels[0].element.addClass("fixed");
            this.options.panels[1].element.addClass("fixed");
        },
        setValue: function (x) {
            var me = this;
            var setPosition = function (idx,pos) {
                me.options.panels[idx].element.css($.extend({
                    margin: 0,position: 'absolute',display: 'block',
                    height: "",width:"",left:"",right:"",top:"",bottom:""
                },pos));
            }
           
            if (me.options.align=='left') {
                setPosition(0,{left:0,top:0,bottom:0,width:x});
                setPosition(1,{right:0,top:0,bottom:0,left:x+this.options.size});
                this.element.css({top:0,bottom:0,left:x,width:this.options.size});
            } else
            if (me.options.align=='right') {
                setPosition(0,{right:0,top:0,bottom:0,width:x});
                setPosition(1,{left:0,top:0,bottom:0,right:x+this.options.size});
                this.element.css({top:0,bottom:0,right:x,width:this.options.size});
            } else
            if (me.options.align=='top') {
                setPosition(0,{left:0,right:0,top:0,height:x});
                setPosition(1,{left:0,right:0,top:x+this.options.size,bottom:0});
                this.element.css({top:x,left:0,right:0,height:this.options.size});
            } else
            if (me.options.align=='bottom') {
                setPosition(0,{left:0,right:0,bottom:0,height:x});
                setPosition(1,{left:0,right:0,top:0,bottom:x+this.options.size});
                this.element.css({bottom:x,left:0,right:0,height:this.options.size});
            }
            this._super(x);
        },
    });
})(teacss.jQuery);