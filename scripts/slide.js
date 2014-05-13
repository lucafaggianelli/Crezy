goog.provide('Crezy.Slide');

Crezy.Slide = function (o) {
    var opts = {id:makeId(),x:0,y:0,width:600,height:400,elements:[]};
    $.extend(opts, o);
    
    this.id = opts.id;
    this.title = opts.title;
    this.description = opts.description;
    
    this.x = opts.x;
    this.y = opts.y;
    this.width = opts.width;
    this.height = opts.height;
    
    this.elements = opts.elements;
    
    this.draw = function() {
        this.ui = $('<div id="'+this.id+'" class="step">');
        this.ui.width(this.width).height(this.height).css({left:this.x,top:this.y});
        this.ui[0].style.border = '1px solid #808080';
        Crezy.canvas._ui.append(this.ui);
        return this;
    };
};
