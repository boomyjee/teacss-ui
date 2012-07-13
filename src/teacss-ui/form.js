teacss.ui.group = teacss.ui.Group = teacss.ui.Control.extend("teacss.ui.Group",{},{
    init: function (options) {
        if (typeof(options)=='string') options = {label:options};
        var $ = teacss.jQuery;
        this._super(options);
        this.element = $("<div>");
        this.header =  $("<h3>").append($("<a href='#'>").html(this.options.label));
    }
});

teacss.ui.fieldset = teacss.ui.Fieldset = teacss.ui.Control.extend("teacss.ui.Fieldset",{},{
    init: function (options) {
        if (typeof(options)=='string') options = {label:options};
        var $ = teacss.jQuery;
        this._super(options);
        this.element = $("<fieldset>");
        if (this.options.label) {
            this.element.append($("<legend>").html(this.options.label));
        }
    }
});

teacss.ui.form = teacss.ui.Form = teacss.ui.Control.extend("teacss.ui.Form",{
    forms: {},
    get: function (options) {
        var sel = options.selector || "body";
        if (!this.forms[sel]) teacss.ui.form(options);
        return this.forms[sel];
    }
},{
    init: function (options) {
        var $ = teacss.jQuery;
        this._super(teacss.jQuery.extend({
            width: 300,
            height: 400,
            align: 'left',
            autoOpen: true,
            items: [],
            selector: "body",
            value: {},
            title: "TeaCss UI"
        },options));
        
        this.value = this.options.value;
        teacss.ui.form.forms[this.options.selector] = this;
        
        var options = this.options;
        var extra = {};
        if (options.align=='left') {
            extra.position = [0,0];
            extra.resizable = this.options.resizable ? "e" : false;
            extra.draggable = false;
            extra.show = false;
            
            extra.resize = function(e,ui) {
                options.width = ui.size.width;
                $("html").css("margin-left",options.width+1);
                $("*.fixed_fix").css("left",options.width+1);
            },
            extra.open = function () {
                $("html").css("margin-left",options.width+1);
                $("*.fixed_fix").css("left",options.width+1);
            }
            extra.close = function () {
                $("html").css("margin-left",0);
                $("*.fixed_fix").css("left",0);
            }
        }        
        
        var me = this;
        this.element = $("<div>")
            .css({overflow:'hidden'});
        
        $(function() {
            me.element.dialog($.extend({
                title: options.title,
                resize: function() {
                    me.panel.accordion("resize");
                },
                create: function(event, ui){
                    var ex_class = options.align=='left' ? 'align-left' : '';
                    $(this).parent().appendTo(teacss.ui.layer).wrap("<div class='teacss-ui-dialog "+ex_class+"'>");
                },
                width: options.width,
                height: options.height,
                autoOpen: false,
                show: 'slide'
            },extra));
        })
                      
        this.panel = $("<div class='composer-panel'>").appendTo(this.element);
        this.icon = $("<div class='teacss_ui_icon'>")
            .click(function(){
                var offset = $(this).offset();
                var pos = [offset.top,offset.left];
                if (options.align=='left') pos = [0,0];
                me.element.dialog("option","position",pos);
                me.element.dialog("open");
                me.panel.accordion("resize");
                $(this).hide();
            })
            
        this.items = [];
        var e = teacss.ui.Control.events.bind("init",function(data,item){  me.items.push(item); });
        this.options.items.call(this);
        teacss.ui.Control.events.unbind(e);
        
        var group = false;
        var fieldset = false;
        for (var i=0;i<this.items.length;i++) {
            var item = this.items[i];
            if (item instanceof teacss.ui.Group) {
                group = item;
                this.panel.append(item.header);
                this.panel.append(item.element);
            } else if (item instanceof teacss.ui.Fieldset) {
                fieldset = item;
                if (group)
                    group.element.append(item.element);
                else
                    this.panel.append(item.element);
            } else {
                this.registerItem(item);
                if (item.options.nested) continue;
                if (fieldset)
                    fieldset.element.append(item.element);
                else if (group) 
                    group.element.append(item.element);
                else
                    this.panel.append(item.element);
            }
        }
        
        this.panel.accordion({fillSpace:true,autoHeight:false,header:"h3"});
        $(window).resize(function(){
            me.panel.accordion("resize");
        });        
        
        $(function () {
            if (options.autoOpen) {
                me.icon.click();
            }
            $(options.selector)
                .append(me.icon)
                .mouseover(function(){
                    if (!me.element.dialog("isOpen"))
                        me.icon.show().css({top:5});
                 })
                .mouseout(function(){  me.icon.find(".teacss_ui_icon").hide(); })
        });
    },
    registerItem: function (item) {
        var me = this;
        item.form = me;
        if (item.options.name!==undefined) {
            item.change(function(){ me.itemChanged(this); });
            item.setValue(me.prop(item.options.name));
        }
        if (item.options.formChange) {
            item.options.formChange.call(item,false,'',me.value);
        }
        
    },
    prop : function(path, value) {
        var layer = this;
        path = (path=="") ? "value" : "value."+path;
        return teacss.ui.prop(layer,path,value);
    },
    itemChanged : function (control,name,value,silent) {
        if (!name) {
            name = (control) ? control.options.name : "";
            value = (control) ? control.getValue() : this.value;
        }

        this.prop(name,value);
        for (var i=0;i<this.items.length;i++) {
            var ctl = this.items[i];
            var ctl_name = ctl.options.name;
            
            if (ctl!=control && ctl.options.name!=undefined) {
                if (name=="" || ctl.options.name==""
                        || (ctl.options.name && ctl.options.name.indexOf(name)==0)
                        || (ctl.options.name && name.indexOf(ctl.options.name)==0)
                ) {
                    var val = this.prop(ctl.options.name);
                    ctl.setValue(val);
                    if (!control) this.prop(ctl.options.name,ctl.getValue());
                }
            }
            if (ctl!=control && ctl.options.formChange) ctl.options.formChange.call(ctl,control,name,value);
        }
        if (!silent && control && !control.options.silent) teacss.update();
    }
    
    
});