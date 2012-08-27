teacss.ui.splitter = teacss.ui.Splitter = (function($){
    return teacss.ui.Control.extend("teacss.ui.Splitter",{},{
        init : function (options) {
            var me = this;
            this._super($.extend({
                value: 600
            },options));
            
            this.element = $("<div>")
                .addClass("ui-splitter")
                .css({
                    position:"absolute",
                    top: 0, bottom: 0,
                    width: 3, background: "#aaa", cursor: "e-resize"
                })
                .draggable({
                    axis: "x",
                    stop: function (e,ui) {
                        me.setValue(ui.position.left);
                        me.trigger("change");
                    },
                    iframeFix: true
                })
          
            this.setValue(this.options.value);
            this.options.panels[0].element.addClass("fixed");
            this.options.panels[1].element.addClass("fixed");
        },
        setValue: function (x) {
            var setPosition = function (ctl,pos) {
                ctl.element.css($.extend({
                    left: 0, top: 0, margin: 0,
                    position: 'absolute',display: 'block'
                },pos));
            }
                
            this.options.position = x;
            setPosition(this.options.panels[0],{bottom:0,width:x});
            setPosition(this.options.panels[1],{bottom:0,left:x+this.element.width(),right:0});
            this.element.css({left:x});
            this._super(x);
        },
    });
})(teacss.jQuery);