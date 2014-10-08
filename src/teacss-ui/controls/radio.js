teacss.ui.radio =  teacss.ui.Radio = teacss.ui.control.extend({
    init: function (o) {
        var me = this;
        this._super($.extend({
            width: 'auto',
            height: 'auto',
            margin: 0,
            items: []
        },o));
        
        this.element = $("<div>").css({
            margin: this.options.margin,
            width: this.options.width,
            height: this.options.height
        });
        
        var cnt = me.Class.cnt = (me.Class.cnt || 0)+1;
        var name = me.name = 'radio_input_'+cnt;
        
        $.each(this.options.items,function(i,item){
            me.element.append(
                $("<label>").append(
                    $("<input type='radio'>").attr({name:name,value:item.value}).change(function(){
                        me.trigger("change")
                    }),
                    item.label
                )
            )
        });
    },
    setValue: function (val) {
        this._super(val);
        this.element.find("input").each(function(){
            if ($(this).val()==val) this.checked = true;
        });
    },
    getValue: function () {
        var val = undefined;
        this.element.find("input").each(function(){
            if (this.checked) val = $(this).val();
        });
        return val;
    }
});