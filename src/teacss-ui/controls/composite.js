teacss.ui.composite = teacss.ui.panel.extend({
},{
    init: function (o) {
        this._super($.extend({
            width: 'auto', margin: 0, table: false, skipForm: false
        },o));
        
        this.element.css({width:'auto',display:'block'}).addClass("ui-composite");
        
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
            $.each(me.options.items,function(){
                var cls = teacss.ui[this.type];
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

                    var label = false;
                    if (this.label && !this.hideLabel) {
                        label = teacss.ui.label({template:this.label,width:"100%"});
                    }
                    
                    if (me.table) {
                        me.table.append($("<tr>").append(
                            $("<td class='ui-composite-label'>").append(label ? label.element : null),                        
                            $("<td class='ui-composite-control'>").append(ctl.element)
                        ));
                        
                        if (cls == teacss.ui.switcher && allObjs) {
                            $.each(ctl.panelList,function(){
                                var trs = this.table.find("tr").appendTo(me.table);
                                this.table.remove();
                                if (this.element.css("display")=="none") trs.hide();
                                this.element = trs;
                            });
                        }
                        
                    } else {
                        if (label)me.push(label);
                        me.push(ctl);
                    }
                } else {
                    console.debug("teacss.ui.composer, can't find type: ",this.type);
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