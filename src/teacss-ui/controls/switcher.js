teacss.ui.switcher = teacss.ui.control.extend({
    init: function (options) {
        var me = this;
        this._super($.extend({
            skipForm: false,
            cleanValue: false
        },options));
        
        if (this.options.skipForm) {
            createControls();
        } else {
            this.innerForm = new teacss.ui.form(createControls);
            this.innerForm.bind("change",function(){
                me.trigger("change");
            });
        }        
            
        function createControls() {
            me.options.repository = me.options.repository || me.Class;
            if (!me.options.types) {
                me.options.types = [];
                for (var key in me.options.repository) {
                    if (me.options.repository.hasOwnProperty(key) && key!="shortName") {
                        var cls = me.options.repository[key];
                        if (
                            (cls && typeof(cls)=="string")
                            || (cls && cls.extend)
                            || (cls && $.isPlainObject(cls) && cls.items)
                        ) {
                            me.options.types.push(key);
                        }
                    }
                }
            }
            me.panels = {};
            me.panelList = [];
            for (var i=0;i<me.options.types.length;i++) {
                var type = me.options.types[i];
                var cls = me.options.repository[type];
                var panel;
                if (cls) {
                    if (typeof(cls)=="string") {
                        panel = teacss.ui.panel(cls);
                    }
                    else if (cls.extend) {
                        panel = new cls({});
                    }
                    else if ($.isPlainObject(cls) && cls.items) {
                        var skipForm = (cls && cls.name) ? false : true;
                        panel = new teacss.ui.composite($.extend(cls,{skipForm:skipForm}));
                    }
                }
                if (panel) {
                    panel.type = type;
                    me.panels[type] = panel;
                    me.panelList.push(panel);
                }
            }
            
            if (me.options.showSelect) {
                me.tabPanel = teacss.ui.panel({
                    width: me.options.width,
                    height: me.options.height,
                    margin: me.options.margin
                });
                
                var items = [];
                $.each(me.options.types,function(){
                    var type = this.toString();
                    items.push({
                        label: me.panels[type].options.label,
                        value: type
                    })
                });
                me.select = teacss.ui.select({items:items,width:'100%',name:"type",preview:false,margin:0});
                
                var selectChange = function() {
                    $.each(me.panelList,function(){
                        if (this.type==me.select.value)
                            this.element.show();
                        else
                            this.element.hide();
                    });
                };
                me.select.bind("change",selectChange);
                me.select.bind("setValue",selectChange);
                
                me.tabPanel.push(me.select);
                $.each(me.panelList,function(i){
                    me.tabPanel.push(this);
                    if (i!=0) this.element.hide();
                });                
                
            } else {
                me.tabPanel = teacss.ui.tabPanel({
                    name:"type",
                    width: me.options.width,
                    height: me.options.height,
                    margin: me.options.margin
                });
                me.tabPanel.bind("select",function(b,tab){
                    if (me.setting) return;
                    this.value = tab.type;
                    this.trigger("change");
                });
                me.tabPanel.setValue = function (value) {
                    var tab = me.panels[value];
                    if (tab) {
                        me.setting = true;
                        this.selectTab(tab);
                        me.setting = false;
                    }                
                }
                $.each(me.panelList,function(){
                    me.tabPanel.push(this);
                });
                if (me.options.types.length==1) me.tabPanel.showNavigation(false);
            }
        };
        me.element = me.tabPanel.element;
    },
    getValue: function () {
        if (!this.innerForm) return false;
        var val = this.innerForm.getValue();
        var type;
        if (val) type = val.type;
        if (!type && this.options.types.length) type = this.options.types[0];
        val = teacss.jQuery.extend({type:type},val);
        return val;
    },
    setValue: function (value) {
        if (!this.innerForm) return;
        value = teacss.jQuery.isPlainObject(value) ? value : {};
        this.innerForm.setValue(value);
    }
})

    
teacss.ui.switcherCombo = teacss.ui.combo.extend({
    init: function (options) {
        var label = options.label;
        delete options.label;
        
        if (options && options.inline && options.height) options.comboHeight = options.height;
        this._super($.extend({
            types: false,
            repository: false,
            labelPlain: label,
            labelTpl: label + ": <span class='button-label'>${value?value.type:'default'}</span>",
            items: function () {
                var switcher = this.switcher = teacss.ui.switcher({
                    types:this.options.types,
                    repository: this.options.repository,
                    width: '100%', height: this.options.comboHeight,
                    margin: 0
                });
                var me = this;
                this.switcher.setValue(this.value);
                this.switcher.change(function(){
                    me.trigger("change");
                    this.getValue();
                    teacss.ui.combo.prototype.setValue.call(me,this.getValue());
                });
                this.switcher.element.css("box-sizing","border-box");
                return [switcher];
            },
            comboWidth: 400,
            comboHeight: 400
        },options));
        
        this.panel.children().eq(0).css("overflow-y","hidden");
        this.options.repository = this.options.repository || this.Class;
    },
    getValue: function () {
        if (this.switcher) 
            this.value = this.switcher.getValue();
        return this.value;
    },
    setValue: function (val) {
        if (this.switcher)
            this.switcher.setValue(val);
        this._super(val);
    },
    getLabel: function() {
        this.options.repository = this.options.repository || this.Class;
        
        var type = 'default';
        if (this.value && this.value.type) type = this.value.type;
        
        if (this.options.repository[type] 
            && this.options.repository[type].switcherLabel) 
        {
            var ret = $(this.options.repository[type].switcherLabel(this.value,this));
            if (this.options.labelPlain)
                ret = $(document.createTextNode(this.options.labelPlain + ": ")).add(ret);
            return ret;
        }
        return this._super();
    }
})