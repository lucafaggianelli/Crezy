goog.provide('Crezy.Chart');

goog.require('Crezy.Element');

Crezy.Chart = function(args) {
    goog.base(this,args);
}
goog.inherits(Crezy.Chart, Crezy.Element);

Crezy.Chart.prototype.edit = function() {
    this.editor = $('<input type="text" class="text-editor" data-type="text" value="'+this.content+'"/>');
    return this.editor;
};

Crezy.Chart.prototype.draw = function() {
    this.ui = new createjs.Shape();
    this.ui.name = this.id;

    this.ui.regX = this.width / 2;
    this.ui.regY = this.height / 2;
    this.ui.scaleX = this.ui.scaleY = this.scale;
    this.ui.x = this.x;
    this.ui.y = this.y;

    var cx = this.w/2,
        cy = this.h/2,
        angle = 0;
    for (var i=0;i<this.data.length;i++) {
        var tmp = angle + this.data[i] * Math.PI*2;
        this.ui.graphics
            .f(Crezy.Element.getColor())
            .mt(cx,cy)
            .a(cx,cy,cx*.9,angle,tmp);
        angle = tmp;
    }

    goog.base(this,'draw',null);
    return this.ui;
};
Crezy.Element.getColor = function() {
    return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}
Crezy.Element._available.chart = Crezy.Chart;
