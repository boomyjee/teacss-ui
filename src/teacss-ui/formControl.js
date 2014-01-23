teacss.ui.formControl = function (sel,cls,config) {
    var ctl;
    var hidden = $(sel).first();
    if (hidden.length) {
        var val = $.parseJSON(hidden.val());
        if (cls instanceof teacss.ui.control) {
            ctl = cls;
        } else {
            ctl = new cls(config);
        }
        ctl.setValue(val);
        
        var layer = hidden.data("layer");
        if (!layer) {
            layer = $("<div class='teacss-ui'>").insertBefore(hidden);
            hidden.data("layer",layer);
        }
        layer.children().hide();
        if (ctl.element.parent()[0]!=layer[0]) layer.append(ctl.element);
        ctl.element.show();
        
        var form = hidden.parents("form").first();
        if (form.length) {
            form.unbind("submit.formControl").bind("submit.formControl",function(){
                var val = ctl.getValue();
                hidden.val(JSON.stringify(val));
            });
        }
    }
    return ctl;
}