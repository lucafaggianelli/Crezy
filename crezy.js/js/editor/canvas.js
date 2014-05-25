goog.provide('Crezy.Editor.Canvas');

goog.require('goog.events')

Crezy.Editor.Canvas = function() {

    this.scale = 1.0;
    this.panning = [0,0,0];
}

Crezy.Editor.Canvas.prototype.draw = function() {
    this.ui = $('#canvas')
        .on('dragstart', '.element', this._onDragStart)
        .on('click', '.element', function() {
            Crezy.currentSlide = Crezy.presentation.slides[$(this).parent('.step')[0].id];
            Crezy.currentElement = Crezy.currentSlide.elements[this.id];
        })
        .bind('dragover', this._onDragOver)
        .bind('drop', this._onDrop);

    // Zoom and pan
    goog.events.listen(document.body, 'mousewheel',
        this._onMouseScroll, false, this);
    goog.events.listen(this.ui[0], 'dragstart', this._onPanCanvasStart, false, this);
    //Crezy.canvas._ui.bind('drag', this._onPanCanvas);
};

Crezy.Editor.Canvas.prototype._onMouseScroll = function(g_evt) {
    console.log(g_evt)
    var event = g_evt.event_;
    if (event.wheelDeltaY == 0) return;
    var zoomDir = event.wheelDeltaY > 0 ? +1 : -1;
    console.log('zoom ', this.scale, zoomDir);
    this.scale = this.scale + zoomDir * this.scale * 0.1;
    this.ui.css('transform', 'scale('+this.scale+')');
}

Crezy.Editor.Canvas.prototype._onPanCanvasStart = function(event) {
    var data = ['pan'];
    data.push(event.originalEvent.clientX);
    data.push(event.originalEvent.clientY);
    console.log('dragstart', data)
    event.originalEvent.dataTransfer.setData("text/html", data.join(','));
}

Crezy.Editor.Canvas.prototype._onPanCanvas = function (event) {
    var data = event.originalEvent.dataTransfer.getData("text/html").split(',');

    //Crezy.canvas._pan[0] += event.originalEvent.clientX + parseInt(data[1],10)
    //Crezy.canvas._ui[0].style[pfx('transform')] = 'translate3d('++')';

    event.originalEvent.preventDefault();
    return false;
}
    
Crezy.Editor.Canvas.prototype._onDragStart = function(event) {
    var data = [];
    data.push('move');
    data.push(this.id);
    data.push($(event.target).position().left - event.originalEvent.clientX);
    data.push($(event.target).position().top - event.originalEvent.clientY);
    event.originalEvent.dataTransfer.setData("text/html", data.join(','));
}

Crezy.Editor.Canvas.prototype._onDragOver = function(event) {
    event.originalEvent.preventDefault();
    var data = event.originalEvent.dataTransfer.getData("text/html").split(',');
        
    if (data[0] == 'pan') {
        this.pan(event.originalEvent.clientX - parseInt(data[1],10),
            event.originalEvent.clientY - parseInt(data[2],10), 0);
    }
    //event.originalEvent.stopPropagation();
    return false;
}

Crezy.Editor.Canvas.prototype._onDrop = function(event) {
    var data = event.originalEvent.dataTransfer.getData("text/html").split(',');
    
    if (data[0] == 'pan') {
        console.log('panned', data);
    } else if (data[0].indexOf('resize') == 0) {
        Crezy.toolbar._onResize(data, event);
    } else if (data[0] == 'move') {
        Crezy.presentation.elements(data[1])
            .x(event.originalEvent.clientX + parseInt(data[2],10))
            .y(event.originalEvent.clientY + parseInt(data[3],10));
        event.originalEvent.preventDefault();
    }
    //event.originalEvent.stopPropagation();
    return false;
}
    
Crezy.Editor.Canvas.prototype.pan = function(x,y,z) {
    this.panning = [x||0,y||0,z||0];
    this.ui.css('transform', 'scale('+this.scale+')translate3d('+this.panning.join('px,')+'px)');
};
