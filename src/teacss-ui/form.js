teacss.ui.layer = (function ($) {
    var layer = $("<div id='teacss-layer' class='teacss-ui'></div>");
    $(function(){
        $("body").append(layer);
    });
    return layer;
})(teacss.jQuery);

teacss.ui.form = function (selector,controlsCallback,options) {
    var $ = teacss.jQuery;
    options = options || {};
    if (this.forms[selector]) return this.forms[selector];
    this.forms[selector] = this.activeForm = {
        controls: {},
        value: options.value || {},
        prop : function(path, value) {
            var layer = this;
            path = (path=="") ? "value" : "value."+path;
            return teacss.ui.prop(layer,path,value);
        },
        change : function (control,name,value,silent) {
            if (!name) {
                name = (control) ? control.options.name : "";
                value = (control) ? control.getValue() : this.value;
            }

            this.prop(name,value);
            for (var ctl_name in this.controls) {
                var ctl = this.controls[ctl_name];
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
    }


    controlsCallback.call();

    var defaults = {
        width: 300,
        height: 400,
        align: 'none',
        autoOpen: false
    }
    options = $.extend({},defaults,options);
    $(function(){ $(selector).eq(0).each(function(){
        var extra = {};
        if (options.align=='left') {
            extra.position = [0,0];
            extra.resizable = false;
            extra.draggable = false;
            extra.show = false;
            extra.open = function () {
                $("html").css("margin-left",options.width+8);
                $("*.fixed_fix").css("left",options.width+8);
            }
            extra.close = function () {
                $("html").css("margin-left",0);
                $("*.fixed_fix").css("left",0);
            }
        }

        var dialog = $("<div>")
            .css({overflow:'hidden'})
            .appendTo("body")
            .dialog($.extend({
                title:'TeaCss UI',
                resize: function() {
                    dialog.panel.accordion("resize");
                },
                create: function(event, ui){
                    var ex_class = options.align=='left' ? 'align-left' : '';
                    $(this).parent().appendTo($("#teacss-layer")).wrap("<div class='teacss-ui-dialog "+ex_class+"'>");
                },
                width: options.width,
                height: options.height,
                autoOpen:false,
                show: 'slide'
            },extra))

        dialog.panel = $("<div class='composer-panel'>").appendTo(dialog);
        for (var group_name in teacss.ui.groups) {
            var group = teacss.functions.ui.groups[group_name];
            var groupHeader = $("<h3>").append($("<a href='#'>").html(group.title));
            var groupPanel = $("<div>");
            var currentPanel = groupPanel;
            for (var fieldset_name in group.fieldsets) {
                var fieldset = group.fieldsets[fieldset_name];
                currentPanel = $("<fieldset>");
                if (fieldset.title) currentPanel.append($("<legend>").html(fieldset.title));
                for (var key in fieldset.params) {
                    if (!fieldset.params[key].options.nested)
                        currentPanel.append(fieldset.params[key].element);
                }
                groupPanel.append(currentPanel);
            }
            dialog.panel.append(groupHeader,groupPanel);
        }
        dialog.panel.accordion({fillSpace:true,autoHeight:false});
        $(window).resize(function(){
            dialog.panel.accordion("resize");
        });

        $("<div class='teacss_ui_icon'>")
            .appendTo(this)
            .click(function(){
                var offset = $(this).offset();
                var pos = [offset.top,offset.left];
                if (options.align=='left') pos = [0,0];
                dialog.dialog("option","position",pos);
                dialog.dialog("open");
                dialog.panel.accordion("resize");
                $(this).hide();
            })
        $(this)
            .mouseover(function(){
                if (!dialog.dialog("isOpen"))
                    $(this).find(".teacss_ui_icon").show();
             })
            .mouseout(function(){  $(this).find(".teacss_ui_icon").hide(); })

        if (options.autoOpen)
            $(".teacss_ui_icon").click();

    })})
    teacss.ui.activeFieldset = false;
    return this.activeForm;
}
