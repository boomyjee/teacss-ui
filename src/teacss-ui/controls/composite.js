teacss.ui.composite = teacss.ui.panel.extend({
},{
    init: function (o) {
        
        var items = o.items;
        this._super($.extend({
            width: '100%', margin: 0, table: false, skipForm: false, tableLabelWidth: false
        },o,{items:[]}));
        this.options.items = items;
        
        this.element.addClass("ui-composite");
        var me = this;
        
        if (me.options.table) {
            me.table = $("<table>");
            this.element.append(me.table).addClass("ui-composite-table");
        }
        
        if (this.options.skipForm) {
            createControls();
        } else {
            this.innerForm = new teacss.ui.form(createControls);
            this.innerForm.bind("change",function(){
                me.trigger("change");
            });
        }
        
        function createControls() {
            
            if (!me.options.items) return;
            if (me.options.items.call) 
                me.options.items = me.options.items.call(this);
            
            $.each(me.options.items,function(i,val){
                if (typeof(val)=="string" || val instanceof String) {
                    me.push(
                        teacss.ui.label({template:val,width:"100%",margin:0})
                    );
                    return;
                }
                
                if (val instanceof teacss.ui.control) {
                    me.push(val);    
                    return;
                }
                
                var cls = this.type;
                if (typeof(cls)=="string" || cls instanceof String) {
                    cls = teacss.ui[cls];
                }
                
                if (cls) {
                    var margin = me.table ? 0 : "0 0 10px 0";
                    if (cls == teacss.ui.switcher && me.table) {
                        if (!this.name) this.skipForm = true;
                        if (this.repository) {
                            var allObjs = true;
                            for (var key in this.repository) {
                                var item = this.repository[key];
                                if ($.isPlainObject(item)) {
                                    item.table = true;
                                } else {
                                    allObjs = false;
                                }
                            }
                        }
                    }
                    
                    var ctl = new cls($.extend({width:"100%",margin:margin},this));
                    var tableLabel = false;
                        
                    if (this.tableLabel && me.table) {
                        tableLabel = teacss.ui.label({template:this.tableLabel,width:"100%"});
                    }
                    
                    if (me.table) {
                        var labelTd;
                        me.table.append($("<tr>").append(
                            labelTd = $("<td class='ui-composite-label'>").append(tableLabel ? tableLabel.element : null),                        
                            $("<td class='ui-composite-control'>").append(ctl.element)
                        ));
                        if (me.options.tableLabelWidth)
                            labelTd.css({width:me.options.tableLabelWidth});
                        
                        if (cls == teacss.ui.switcher && allObjs) {
                            $.each(ctl.panelList,function(){
                                var trs = this.table.find("tr").appendTo(me.table);
                                this.table.remove();
                                if (this.element.css("display")=="none") trs.hide();
                                this.element = trs;
                            });
                        }
                        
                    } else {
                        me.push(ctl);
                    }
                } else {
                    console.debug("teacss.ui.composer, can't find type: ",this.type,this);
                }
            });
        };
    },
    
    getValue: function () {
        if (!this.innerForm) return false;
        return this.innerForm.getValue();
    },
    
    setValue: function (value) {
        if (!this.innerForm) return;
        value = teacss.jQuery.isPlainObject(value) ? value : {};
        this.innerForm.setValue(value);
    }
});