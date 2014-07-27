goog.provide('Crezy.Editor.Grid');

Crezy.Editor.Grid = function() {
    this.type = 'dots';
    this.step = 30;
    this.width = 1;
    this.style = '#a0a0a0';
};

Crezy.Editor.Grid.prototype.draw = function() {
    this.ui = $('#crezy-grid')
        .attr({width: window.innerWidth, height: window.innerHeight});
        
    var ctx = this.ui[0].getContext('2d'),
        w = this.ui[0].width,
        h = this.ui[0].height;
        
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.style;
    ctx.fillStyle = this.style;

    switch(this.type) {
    case 'lines':
        for (var i = .5; i < w; i += this.step) {
            ctx.beginPath();
            ctx.moveTo(i,0);
            ctx.lineTo(i,h);
            ctx.stroke();
        }
        for (var i = .5; i < h; i += this.step) {
            ctx.beginPath();
            ctx.moveTo(0,i);
            ctx.lineTo(w,i);
            ctx.stroke();
        }
        break;
    case 'dots':
        for (var i = .5; i < w; i += this.step) {
            for (var j = .5; j < h; j += this.step) {
               ctx.fillRect(i,j,this.width,this.width);
            }
        }
        break;

    default: break;
    }
}
