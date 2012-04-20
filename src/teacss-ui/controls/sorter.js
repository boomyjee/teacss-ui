teacss.ui.sorter = teacss.ui.Sorter = teacss.ui.Control.extend("teacss.ui.Sorter",{},{
    setValue: function (value) {
        this.value = value;
        this.refresh();
    },
    init : function(options) {
        var me = this;
        this._super(teacss.jQuery.extend({
            panelClass: ""
        },options));
        this.value = options.value || {};

        this.element = teacss.jQuery("<div>")
            .addClass("ui-sorter "+this.options.panelClass)
            .css({
                display: (me.options.width=='auto') ? 'block' : 'inline-block',
                'vertical-align':'bottom',
                width: me.options.width,
                margin: me.options.margin
            })
        this.refresh();
    },
    refresh : function () {
        var me = this;
        this.element.html("");
        for (var key in this.value) {
            var container = teacss.jQuery("<fieldset><legend>"+key+"</legend></fieldset>");
            var list = this.value[key];
            for (var i=0;i<list.length;i++) {
                var item = teacss.jQuery("<div>").html(list[i]).data("sorter",list[i]);
                container.append(item);
            }
            container.data("sorter",key);
            this.element.append(container);
        }
        this.element.find("fieldset").sortable({
            items: "> div",
            connectWith: this.element.find("fieldset"),
            stop: function(){
                var containers = me.element.children();
                var value = {};
                for (var c=0;c<containers.length;c++) {
                    var container = containers[c];
                    var key = teacss.jQuery(container).data("sorter");
                    if (key) {
                        value[key] = [];
                        var list = teacss.jQuery(container).children("div");
                        for (var i=0;i<list.length;i++) {
                            var item = list[i];
                            var data = teacss.jQuery(item).data("sorter");
                            if (data) {
                                value[key].push(data);
                            }
                        }
                    }
                }
                me.value = value;
                me.trigger("change");
            }
        })
    }
})