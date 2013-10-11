teacss.ui.repeater = teacss.ui.panel.extend({
    init: function (o) {
        var me = this;
        this._super($.extend({
            width: '100%',
            addLabel: 'Add Element'
        },o));
        
        this.element.addClass("ui-repeater");
        if (this.options.repeaterClass)
            this.element.addClass(this.options.repeaterClass);
        
        this.addButton = $("<a href='#'>").text(this.options.addLabel)
            .addClass('add-button')
            .click(function(e){ 
                e.preventDefault();
                me.newElement();
                me.trigger("change");
            });
        
        this.pagination = $("<div>").addClass("pagination");
        this.container = $("<div>").addClass("ui-repeater-container");
        this.footer = $("<div>").addClass("ui-repeater-footer").append(this.addButton);
        
        this.element.append(this.pagination, this.container, this.footer);
    },
    
    itemTemplate: function (el) {
        var me = this;
        var closeLink = $("<a href='#' class='ui-icon ui-icon-close'>").click(function(e){
            e.preventDefault();
            me.removeElement(el);
            me.trigger("change");
        });
        return $("<div class='ui-repeater-item'>")
            .append(
                $("<div class='ui-repeater-item-title'>").append(closeLink),
                $("<div class='ui-repeater-item-content'>").append(el.element)
            );
    },
    
    push: function (el) {
        if (!(el instanceof teacss.ui.Control)) return;
        
        var me = this;
        this.container.append(el.itemContainer = me.itemTemplate(el));
        var count = this.container.children().length;
        el.page = $("<a href='#'>").text(count);
        el.select = el.page.select = function (e) {
            if (e) e.preventDefault();
            me.select(el);
        }
        el.page.click(el.page.select);
        el.page.data("element",el);
        
        this.pagination.append(el.page);
        return el;
    },
    
    select: function (el) {
        var me = this;
        me.pagination.find(".selected").removeClass("selected");
        me.container.find("> .selected").removeClass("selected");
        el.page.addClass("selected");
        el.itemContainer.addClass("selected");
        el.element.show();
        return el;
    },
    
    newElement: function () {
        var el = this.addElement();
        el.select();         
        return el;
    },
    
    addElement: function (val) {
        val = val || {};
        var el = teacss.ui.composite({items:this.options.items,table:this.options.table});
        el.setValue(val);
        var me = this;
        el.bind("change",function(){
            me.trigger("change");
        });
        this.push(el);
        return el;
    },
    
    removeElement: function (el) {
        if (!el) {
            var page = this.pagination.find(".selected");
            var idx = page.index();
            el = page.data("element");
        }
        
        if (el) {
            el.page.remove();
            el.itemContainer.remove();
            
            var sel = this.pagination.children().eq(idx);
            if (!sel.length) sel = this.pagination.children().last();
            if (sel.length) {
                sel.click();
            }
            
            this.pagination.children().each(function(i){
                $(this).text((i+1).toString());
            });
        }
    },
    
    getValue: function () {
        var val = [];
        this.pagination.children().each(function(){
            var el = $(this).data("element");
            if (el) val.push(el.getValue());
        });
        return val;
    },
    
    setValue: function (val) {
        this.pagination.empty();
        this.container.empty();
        val = val || [];
        var me = this;
        var first;
        $.each(val,function(i){
            var el = me.addElement(this);
            if (i==0) first = el;
        });
        if (first) first.select();
    }
});