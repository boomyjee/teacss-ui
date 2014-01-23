teacss.ui.panel = teacss.ui.Panel = teacss.ui.Control.extend("teacss.ui.Panel",{},{
    init : function(options) {
        if (typeof(options)=='string') options = {label:options};
        this._super(teacss.jQuery.extend({
            'text-align':'left',
            items: [],
            elementTag: "div",
            padding: 0
        },options));
        this.element = teacss.jQuery("<"+this.options.elementTag+">")
            .css({
                display: 'inline-block',
                width: this.options.width,
                height: this.options.height,
                'text-align': this.options['text-align'],
                margin: this.options.margin,
                padding: this.options.padding,
                verticalAlign: 'bottom',
                '-moz-box-sizing':'border-box',
                '-webkit-box-sizing':'border-box',
                'box-sizing':'border-box'
            });
        
        if (this.options.width!='auto' && this.options.height!='auto') this.element.addClass("fixed");
            
        this.items = [];
        this.push(this.options.items);
    },
    
    push: function (what) {
        if (!what) return this;
        if (arguments.length>1) {
            for (var i=0;i<arguments.length;i++) this.push(arguments[i]);
        }
        else if (what.constructor == Array) {
            for (var i=0;i<what.length;i++) this.push(what[i]);
        } 
        else if (what.call && what.apply) {
            var items = [];
            var e = teacss.ui.Control.events.bind("init",function(data,item){  items.push(item); });
            what = what.call(this);
            teacss.ui.Control.events.unbind(e);
            if (!what) what = items;
            this.push(what);
        } 
        else {
            if (what instanceof teacss.ui.Control) {
                this.element.append(what.element);
                what.options.nested = true;
                
                if (this.options.layout) {
                    what.element.css(this.options.layout);
                }
            } else {
                this.element.append(what);
            }
            this.items.push(what);
        }
        return this;
    }
})