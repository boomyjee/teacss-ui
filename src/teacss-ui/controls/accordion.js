teacss.ui.accordion = teacss.ui.Accordion = teacss.ui.Panel.extend({
    init: function (options) {
        this._super(options);
        this.accordionOptions = {fillSpace:true,autoHeight:false,header:"h3"};
        this.inner = teacss.jQuery("<div>").appendTo(this.element);
        
        var me = this;
        teacss.jQuery(window).resize(function(){
            me.inner.accordion("resize");
        });                    
    },
    push: function (what) {
        if (arguments.length==1 && what instanceof teacss.ui.Control) {
            this.addGroup(what);
        } else {
            this._super.apply(this,arguments);
        }
        return this;
    },
    addGroup: function (group) {
        var $ = teacss.jQuery;
        
        this.inner.accordion("destroy");
        this.inner.append($("<h3>").append($("<a href='#'>").html(group.options.label)));
        this.inner.append(group.element);

        group.element.css({display:"block",margin:0,height:'',width:''});
        
        this.inner.accordion(this.accordionOptions);
    }
});