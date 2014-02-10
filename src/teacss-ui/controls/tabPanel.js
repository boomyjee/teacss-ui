(function ($,ui){

teacss.ui.tabPanel = teacss.ui.Panel.extend({
    tabIndex: 0
},{
    init: function(options) {
        var me = this;
        var $ = teacss.jQuery;
        this._super($.extend({
            height: '100%'
        },options));
        
        // structure for ui.tabs
        this.element.css({
            height: this.options.height,
            position: 'relative'
        });
        
        this.element.append("<ul></ul>");
        this.element.tabs({
            add: function (e,ui) {
                setTimeout(function(){
                    $(ui.panel).find(".ui-accordion").accordion("resize");
                },1);
            },
            activate: function (e,ui) { 
                var tab = $(ui.newPanel).data("tab");
                if (tab) {
                    tab.trigger("select",tab);
                	me.trigger("select",tab);
                    setTimeout(function(){
                        tab.element.find(".ui-accordion").accordion("resize");
                    },1);
                }
            }
        });
        this.element.find(".ui-tabs-nav:first").sortable({
            axis: "x",
            helper: function(e, item) {
                var h = item;
                h.width(item.width()+2);
                return h;
            },
            distance: 3,
            sort: function (event, ui) {
                var that = $(this),
                w = ui.helper.outerWidth();
                that.children().each(function () {
                    if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass('ui-sortable-placeholder')) 
                        return true;
                    // If overlap is more than half of the dragged item
                    var dist = Math.abs(ui.position.left - $(this).position().left),
                        before = ui.position.left > $(this).position().left;
                    if ((w - dist) > (w / 2) && (dist < w)) {
                        if (before)
                            $('.ui-sortable-placeholder', that).insertBefore($(this));
                        else
                            $('.ui-sortable-placeholder', that).insertAfter($(this));
                        return false;
                    }
                });
            },    
            stop: function (e, ui) {
                $(this).children().css('width','');
                // resort panels too
                var panels = $([]);
                $(this).children().each(function(){
                    var href = $(this).find(".ui-tabs-anchor").attr("href");
                    var panel = me.element.find(href).detach();
                    panels = panels.add(panel);
                });
                me.element.append(panels);
                me.trigger("sortstop");
            },
            containment: 'parent'
        });
        
        this.element.css({background:"transparent",padding:0});
        this.element.on("click","span.ui-icon-close", function(){
            var href = $(this).prev().attr("href");
            var tab = me.element.find(href).data("tab");
            if (tab) me.closeTab(tab);
        });
    },
    
    showNavigation: function (flag) {
        if (!flag) {
            this.element.find("> .ui-tabs-nav:first").hide();
            this.element.find("> .ui-tabs-panel").css({top:0});
            this.element.addClass("ui-no-nav");
        } else {
            this.element.find("> .ui-tabs-nav:first").show();
            this.element.find("> .ui-tabs-panel").css({top:''});
            this.element.removeClass("ui-no-nav");
        }
    },
    
    push: function (what) {
        if (what instanceof teacss.ui.Control) {
            this.addTab(what);
        } else {
            this._super(what);
        }
        return this;
    },
    
    count: function () {
        return this.element.children(".ui-tabs-panel").length;
    },
    refresh: function () {
        this.element.tabs("refresh");
        this.trigger("refresh");
    },
    
    closeTab: function (tab,silent) {
        var e = {tab:tab,cancel:false};
        if (!silent) tab.trigger("close",e);
        if (!e.cancel) {
            this.element.find("#"+tab.options.id).remove();
            this.element.find("a[href=#"+tab.options.id+"]").parent().remove();
            tab.tabPanel = false;
            this.refresh();
        }
    },
    addTab: function (tab,index) {
        if (!(tab instanceof teacss.ui.Control)) tab = teacss.ui.panel(tab);
        var id = 'tab' + teacss.ui.tabPanel.tabIndex++;
        
        if (tab.options.closable) {
            tabTemplate = "<li><a href='#{href}'>#{label}</a><span class='ui-icon ui-icon-close'>Close</span></li>"
        } else {
            tabTemplate = "<li><a href='#{href}'>#{label}</a></li>"
        }
        
        var label = tab.options.caption || tab.options.label || "Tab "+teacss.ui.tabPanel.tabIndex;
        this.element.find(".ui-tabs-nav").first().append(
            tab.navElement = $(tabTemplate.replace("#{href}",'#'+id).replace("#{label}",label))
        );
        this.element.append(tab.tabElement = $("<div>",{id:id}).append(tab.element).data("tab",tab));
        this.refresh();
        
        tab.element.css({width:'100%',height:'100%', margin: 0,display:'block'});
        
        tab.options.nested = true;
        tab.options.id = id;
        tab.tabPanel = this;
        
        if (this.count()<2) this.selectTab(tab);
        return tab;
    },
    selectTab: function(tab) {
        var idx = this.element.find("#"+tab.options.id).index();
        idx = idx - ( this.element.children().length - this.count() );
        this.element.tabs( "option", "active", idx);
    },
    prevTab: function () {
        var sel = this.element.tabs("option","selected");
        if (sel>0) this.element.tabs("option","selected",sel-1);
    },
    nextTab: function () {
        var sel = this.element.tabs("option","selected");
        var N = this.element.tabs("length");
        if (sel+1<N) this.element.tabs("option","selected",sel+1);
    },
    selectedTab: function () {
        var sel = this.element.tabs("option","selected");
        if (sel<0) return false;
        return this.element.find("> div.ui-tabs-panel").eq(sel).data("tab");
    }
});
    
})(teacss.jQuery,teacss.ui);