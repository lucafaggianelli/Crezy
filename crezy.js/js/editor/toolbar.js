goog.provide('Crezy.Editor.Toolbar');

Crezy.Editor.Toolbar = function() {

}

Crezy.Editor.Toolbar.prototype.draw = function() {
    // Create UI
    this.ui = $('<div id="toolbar-container"></div>');
    this.ui.hide();

    var cardinals = ['n','s','e','w','ne','nw','se','sw'], car, html = '';
    for (var i in cardinals) {
        car = cardinals[i];
        html += '<div class="handle-'+car+'" data-action="resize-'+car+'" draggable="true"></div>';
    }
    this.ui.append('<div id="toolbar">'+html+'</div>');
    this.ui.appendTo(document.body);
    
    this.ui.find('[data-action^="resize-"]').bind('dragstart', this._onCardinalDragStart);
    
    this.ui.appendTo(document.body);
    
    this._drawCarthesianAxis();
}

Crezy.Editor.Toolbar.prototype._drawCarthesianAxis = function() {
    this.carthesianUi = $('<canvas id="carthesian-axis" width="100" height="100"></canvas>');
    var ctx = this.carthesianUi[0].getContext('2d'),
        w = this.carthesianUi[0].width-1,
        h = this.carthesianUi[0].height-1,
        center = [ w/2, h/2],
        points = [[.5,.05],[.95,.5],[.05,.95]];

    ctx.strokeStyle = "#404040";
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    for (var i in points) {
        ctx.moveTo(center[0], center[1]);
        ctx.lineTo(points[i][0]*w, points[i][1]*h);
        ctx.stroke();
    }
   
    this.carthesianUi.appendTo(document.body);
}

Crezy.Editor.Toolbar.prototype._onCardinalDrop = function(data, event) {
    var width = event.originalEvent.clientX-parseInt(data[2]),
        height = event.originalEvent.clientY-parseInt(data[3]);
    var elem = Crezy.currentElement;
    
    switch (data[0]) {
    case 'resize-n': this.resizeN(elem, height); break;
    case 'resize-s': this.resizeS(elem, height); break;
    case 'resize-e': this.resizeE(elem, width); break;
    case 'resize-w': this.resizeW(elem, width); break;
    case 'resize-ne': this.resizeN(elem, height); this.resizeE(elem, width); break;
    case 'resize-nw': this.resizeN(elem, height); this.resizeW(elem, width); break;
    case 'resize-se': this.resizeS(elem, height); this.resizeE(elem, width); break;
    case 'resize-sw': this.resizeS(elem, height); this.resizeW(elem, width); break;
    default: console.log('Resizing '+data[0]+' not supported'); break;
    }
}

Crezy.Editor.Toolbar.prototype._onCardinalDragStart = function(event) {
    var data = [];
    data.push($(this).data('action'));
    data.push(this.id);
    data.push(event.originalEvent.clientX);
    data.push(event.originalEvent.clientY);
    event.originalEvent.dataTransfer.setData("text/html", data.join(','));
}

Crezy.Editor.Toolbar.prototype.attachTo = function(elem) {
    this.ui.css({
        height: elem.ui.height(),
        width: elem.ui.width(),
    });
    this.ui.show();
};

Crezy.Editor.Toolbar.prototype.resizeN = function(elem, h) {
    elem.height('-='+h);
    elem.y('+='+h);
};
Crezy.Editor.Toolbar.prototype.resizeS = function(elem, h) {
    elem.height('+='+h);
};
Crezy.Editor.Toolbar.prototype.resizeE = function(elem, w) {
    elem.width('+='+w);
};
Crezy.Editor.Toolbar.prototype.resizeW = function(elem, w) {
    elem.width('-='+w);
    elem.x('+='+w);
};

Crezy.Editor.Toolbar.prototype.show = function(elem) {
    elem = elem || null;
    if (!elem) return;

    /*
    if (element.classList.contains('element')) {
        Crezy.currentSlide = Crezy.presentation.slides[$(this).parent('.step')[0].id];
        Crezy.currentElement = Crezy.currentSlide.elements[this.id];
    }*/

    /*var pos = elem.ui.position(),
        css = {top: pos.top, left: pos.left, width: elem.width(), height: elem.height()};
    this.ui.css(css).show();*/
}

Crezy.Editor.Toolbar.prototype.hide = function() {
    this.ui.hide();
}
