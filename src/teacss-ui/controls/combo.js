// TODO: make combo control panels draggable
function value_equals(y,x) {
    if (y===x) return true;
    if (y==undefined || x==undefined) return false;
    if (typeof(y)!=typeof(x)) return false;
    if (y.constructor==Array) {
        if (x.constructor!=Array) return false;
        if (x.length!=y.length) return false;
        for (var i=0;i<x.length;i++) {
            if (!value_equals(y[i],x[i])) return false;
        }
        return true;
    }
    if (typeof(y)!='object' && x!=y) return false;
    for (var p in y) {
        if (!value_equals(y[p],x[p])) return false;
    }
    for (p in x) {
        if ( x.hasOwnProperty(p) && ! y.hasOwnProperty(p)) return false;
    }    
    return true;
}

teacss.ui.combo = teacss.ui.Combo = teacss.ui.Control.extend("teacss.ui.Combo",{
    list:[]
},{
    setValue: function(value) {
        this.value = value;
        var found = false;
        for (var i=0;i<this.items.length;i++) {
            var item = this.items[i];
            if (item instanceof teacss.ui.Control) continue;
            if (item.disabled) continue;
            if (value===undefined && !item.disabled) {
                this.selected = item;
                this.value = (item.value==undefined) ? item : item.value;
                found = true;
                break;
            }
            if (value===item || value_equals(value,item.value)) {
                this.selected = item;
                found = true;
                break;
            }
        }
        if (!found) this.selected = {value:value};
        this.element.button("option",{label:this.getLabel()});
        if (this.panel.css("display")!="none") {
            this.selected_on_open = this.selected;
            this.setSelected();
        }
        this.trigger("setValue");
    },
    setSelected : function () {
        var me = this;
        me.itemPanel.find(">*").removeClass("selected").each(function(){
            var item = teacss.jQuery(this).data("item");
            if (item &&
                 (item===me.selected_on_open
                  || (item.value!=undefined
                        && me.selected_on_open
                        && value_equals(item.value,me.selected_on_open.value)
                     )
                 )
               ) {
                teacss.jQuery(this).addClass("selected");
            }
        })
    },
    setEnabled : function (enabled) {
        this.enabled = enabled;
        if (this.element)
            this.element.button("option",{disabled:!enabled});
    },
    init: function (options) {
        this._super(teacss.jQuery.extend({
            comboWidth : false,
            comboHeight: 300,
            comboDirection: 'default',
            closeOnSelect: true,
            itemTpl:[
                "{{if group}}",
                  "<div class='combo-group'>${group}</div>",
                "{{else}}",
                  "<div class='combo-item'>",
                    "{{if icon}}",
                      "<div class='combo-icon' style='",
                            "width:{{if iconWidth}}${iconWidth}px{{else}}auto{{/if}};",
                            "height:{{if iconHeight}}${iconHeight}px{{else}}auto{{/if}};",
                        "'>",
                        "<img src='${icon}' style='",
                            "max-width:{{if iconWidth}}${iconWidth}px{{else}}none{{/if}};",
                            "max-height:{{if iconHeight}}${iconHeight}px{{else}}none{{/if}};",
                        "'>",
                      "</div>",
                    "{{/if}}",
                    "{{if spriteUrl}}",
                      "<div class='combo-sprite' style='background: url(${spriteUrl}) ${-spriteX*spriteWidth}px ${-spriteY*spriteHeight}px;width:${spriteWidth}px;height:${spriteHeight}px'></div>",
                    "{{/if}}",
                    "{{if label}}<span class='combo-label'>${label}</span>{{/if}}",
                  "</div>",
                "{{/if}}"
            ],
            label: false,
            preview: false
        },options));

        this.options.itemData = teacss.jQuery.extend({},{
                spriteWidth: 50,
                spriteHeight: 50,
                spriteX : 0,
                spriteY : 0,
                spriteUrl : false,
                icon: false
            },
            this.options.itemData || {}
        );

        if (this.options.itemTpl.constructor==Array) this.options.itemTpl = this.options.itemTpl.join("");
        teacss.ui.Combo.list.push(this);

        this.items = options.items || [];
        this.value = options.value || false;

        if (options.open) this.bind("open",options.open);

        var me = this;
        me.selected = options.selected || ((options.selectedIndex!=undefined)?me.items[options.selectedIndex]:undefined);
        if (!this.value && this.selected) this.value = this.selected.value || this.selected;

        this.panel = teacss.jQuery("<div>")
            .addClass('button-select-panel teacss-ui')
            .css({
                position: 'absolute',
                display: 'none',
                width: this.options.comboWidth,
                'z-index': 10000
            })

        this.itemPanel = teacss.jQuery("<div>")
            .css({
                'max-height': this.options.comboHeight,
                'min-height': 40,
                'overflow-y': 'auto'
            })
            .appendTo(this.panel);

        this.element = teacss.jQuery("<div>")
            .css({width:this.options.width=='100%' ? 'auto' : this.options.width,
                  'vertical-align':'bottom',margin:this.options.margin,
                  display:this.options.width=='100%' ? 'block' : 'inline-block'
             })
            .button({label:this.getLabel(),icons:this.options.icons})
            .click(function(e){
                if (!me.enabled) return;

                me.itemsArray();
                me.trigger("open");
                me.selected_on_open = me.selected;

                var off = me.element.offset();
                var maxZ = 9999;
                for (var i=0;i<teacss.ui.Combo.list.length;i++) {
                    var combo = teacss.ui.Combo.list[i];
                    if (combo!=this && combo.panel.css("display")!="none") {
                        var z = parseInt(combo.panel.css("z-index"));
                        if (z>maxZ) maxZ = z;
                    }
                }
                me.setSelected();

                var panelPos;
                if (me.options.comboDirection!='right')
                    panelPos = {left:off.left,top: off.top+me.element.height()+3}
                else
                    panelPos = {left:off.left + me.element.width()+3,top: off.top}

                // TODO: Adjust top for panel to fit the screen
                me.panel.css({
                    left:panelPos.left,
                    top: panelPos.top - teacss.jQuery(window).scrollTop(),
                    display: "",
                    "z-index":maxZ + 1,
                    width: me.options.comboWidth || (me.element).width()
                })
            })

        this.setEnabled(this.options.enabled);
        if (options.buttonClass) me.element.addClass(options.buttonClass);
        if (options.panelClass) me.itemPanel.addClass(options.panelClass);

        me.panelClick = false;
        me.panel.mousedown(function(e){
            me.panelClick = true;
            var combo = me;
            while (combo.parentCombo) {
                combo = combo.parentCombo;
                combo.panelClick = true;
            }
        });
        if (!teacss.jQuery.isFunction(me.items)) me.refresh();
        teacss.jQuery(function(){
            me.panel.appendTo(teacss.ui.layer);
            teacss.jQuery(document).mousedown(function(){
                if (!me.panelClick) me.hide();
                me.panelClick = false;
            });
        })
    },
    itemsArray: function () {
        var me = this;
        if (teacss.jQuery.isFunction(me.items)) {
            me.items = me.items();
            me.refresh();
        }
        return me.items;
    },
    refresh : function () {
        var me = this;
        me.itemPanel.html("");
        tpl = teacss.jQuery.template(null,me.options.itemTpl);

        for (var i=0;i<me.items.length;i++) {
            var item = me.items[i];
            if (item instanceof teacss.ui.Control) {
                var el = item.element;
                if (item instanceof teacss.ui.Combo) {
                    if (item.options.comboDirection=='default') item.options.comboDirection = 'right';
                    item.parentCombo = this;
                }
                item.options.nested = true;
            } else {
                var el = teacss.jQuery(teacss.jQuery.tmpl(tpl,teacss.jQuery.extend({},me.options.itemData,item)));
                el.data("item",item);
                if (!item.disabled) {
                    var leaveTimeout = 0;
                    el.mouseenter(function(e){
                        // TODO: exit preview when some mouse button is down
                        if (!me.options.preview) return;
                        if (leaveTimeout) {
                            clearTimeout(leaveTimeout);
                            leaveTimeout = 0;
                        }
                        var item = teacss.jQuery(this).data("item");
                        me.value = (item.value==undefined) ? item :  item.value;
                        me.change();
                        return true;
                    }).mouseleave(function(){
                        if (!me.options.preview) return;
                        leaveTimeout = setTimeout(function() {
                            me.value = (me.selected_on_open.value==undefined) ? me.selected_on_open:me.selected_on_open.value;
                            me.change();
                        },1);
                    })
                    el.mousedown(function(e){
                        me.selected = teacss.jQuery(this).data("item");
                        me.element.button("option",{label:me.getLabel()});
                        me.value = (me.selected.value==undefined) ? me.selected : me.selected.value;
                        me.selected_on_open = me.selected;

                        if (me.options.closeOnSelect)
                            me.hide();
                        else
                            me.setSelected();

                        me.change();
                    })
                }
            }
            me.itemPanel.append(el);
        }
    },
    getLabel : function() {
        return this.options.label || teacss.jQuery.tmpl(
                this.options.labelTpl || this.options.itemTpl,
                teacss.jQuery.extend({},this.options.itemData,this.selected)
        );
    },
    hide : function(e) {
        this.panel.css("display","none");
    }
})