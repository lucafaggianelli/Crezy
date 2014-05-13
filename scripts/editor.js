goog.provide('Crezy.Editor');

goog.require('Crezy.Element');
goog.require('Crezy.Slide');
goog.require('Crezy.Presentation');

window.onload = function() {

    Crezy.presentation = new Crezy.Presentation();
    Crezy.currentElement = null;
    
    Crezy.grid._init();
    Crezy.canvas._init();
    Crezy.elementToolbar._init();
    $(document).keydown(Crezy.keyListener);
    
    $('#sidebar li').click(function(event) {
        switch(this.id) {
            case 'load':
                Crezy.loadPresentation();
                break;
            case 'save':
                Crezy.savePresentation();
            case 'new-slide':
                var slide = new Crezy.Slide();
                slide.draw();
                Crezy.presentation.slides[slide.id] = slide;
                Crezy.currentSlide = slide;
                break;
            case 'new-text':
                var el = new Crezy.TextEditor();
                el.draw(Crezy.currentSlide.ui);
                Crezy.currentSlide.elements.push(el);
                Crezy.currentElement = el;
            default: break;
        }
    });
};

Crezy.save = function(presentation) {
    if (!Modernizr.localstorage) {
        console.log('LocalStorage not supported');
        return;
    }
    if (!presentation) return;
    
    for (var i in presentation.elements) presentation.elements[i]._save();
    localStorage['crezy'] = JSON.stringify(presentation);
    return true;
};
replacer = function(key, value) {
    if (key == 'ui') {
        return undefined;
    } else {
        return value;
    }
}
Crezy.load = function() {
    if (!Modernizr.localstorage) {
        console.log('LocalStorage not supported');
        return;
    }
    
    var p = localStorage['crezy'];
    if (!p) return {};
    
    return JSON.parse(p);
};

Crezy.savePresentation = function() {
    this.save(Crezy.presentation);
};

Crezy.loadPresentation = function() {
    Crezy.presentation = new Presentation(this.load());
    
    for (var i in Crezy.presentation.elements) {
        Crezy.presentation.elements[i].draw();
    }
    return true;
};

Crezy.keyListener = function(event) {
    var k = event.which >= 65 ? String.fromCharCode(event.which).toLowerCase() : event.which;
    console.log(event.which, k);
    
    switch(k) {
    // left, up, right, down
    case 37: Crezy.currentElement.x('-=5'); break;
    case 38: Crezy.currentElement.y('-=5'); break;
    case 39: Crezy.currentElement.x('+=5'); break;
    case 40: Crezy.currentElement.y('+=5'); break;
    
    case 'w': // 87
        Crezy.currentElement.rotateX('+=5');
        break;
    case 's': // 83
        Crezy.currentElement.rotateX('-=5');
        break;
    case 'a': // 65
        Crezy.currentElement.rotateY('-=5');
        break;
    case 'd': // 68
        Crezy.currentElement.rotateY('+=5');
        break;
    case 'q': // 81
        Crezy.currentElement.rotateZ('-=5');
        break;
    case 'e': // 69
        Crezy.currentElement.rotateZ('+=5');
        break;
        
    default: break;
    }
};

Crezy.grid = {
    _init: function() {
        Crezy.grid._ui = $('#grid');
        Crezy.grid._ui.attr({width: window.innerWidth, height: window.innerHeight});

        Crezy.grid.draw();
    },
    
    step: 30,
    width: .5,
    style: '#a0a0a0',
    
    draw: function() {
        var ctx = Crezy.grid._ui[0].getContext('2d'),
            w = Crezy.grid._ui[0].width,
            h = Crezy.grid._ui[0].height;
        ctx.lineWidth = Crezy.grid.width;
        ctx.strokeStyle = Crezy.grid.style;

        for (var i = 0; i < w; i += Crezy.grid.step) {
            ctx.beginPath();
            ctx.moveTo(i,0);
            ctx.lineTo(i,h);
            ctx.stroke();
        }

        for (var i = 0; i < h; i += Crezy.grid.step) {
            ctx.beginPath();
            ctx.moveTo(0,i);
            ctx.lineTo(w,i);
            ctx.stroke();
        }
    }    
};

Crezy.canvas = {

    _init: function() {
        Crezy.canvas._ui = $('#canvas');
        Crezy.canvas._ui.on('dragstart', '.element', this._onDragStart);
        Crezy.canvas._ui.on('click', '.element', function() {
            Crezy.currentSlide = Crezy.presentation.slides[$(this).parent('.step')[0].id];
            Crezy.currentElement = Crezy.currentSlide.elements[this.id];
        });
        Crezy.canvas._ui.bind('dragover', this._onDragOver);
        Crezy.canvas._ui.bind('drop', this._onDrop);
        
        // Zoom and pan
        //document.addEventListener('mousewheel', this._onMouseWheel, false);
        //Crezy.canvas._ui.bind('dragstart', this._onPanCanvasStart);
        //Crezy.canvas._ui.bind('drag', this._onPanCanvas);
    },

    _scale: 1.0,
    _onMouseWheel: function(e) {
        if (event.wheelDeltaY == 0) return;
        var zoomDir = event.wheelDeltaY > 0 ? +1 : -1;
        console.log('zoom ', Crezy.canvas._scale, zoomDir);
        Crezy.canvas._scale = Crezy.canvas._scale + zoomDir * Crezy.canvas._scale * 0.1;
        Crezy.canvas._ui[0].style[pfx('transform')] = 'scale('+Crezy.canvas._scale+')';
    },

    _pan: [0,0,0],
    _onPanCanvasStart: function(event) {
        var data = ['pan'];
        data.push(event.originalEvent.clientX);
        data.push(event.originalEvent.clientY);
        event.originalEvent.dataTransfer.setData("text/html", data.join(','));
    },
    
    _onPanCanvas: function (event) {
        var data = event.originalEvent.dataTransfer.getData("text/html").split(',');

        //Crezy.canvas._pan[0] += event.originalEvent.clientX + parseInt(data[1],10)
        //Crezy.canvas._ui[0].style[pfx('transform')] = 'translate3d('++')';

        event.originalEvent.preventDefault();
        return false;
    },
    
    _onDragStart: function(event) {
        var data = [];
        data.push('move');
        data.push(this.id);
        data.push($(event.target).position().left - event.originalEvent.clientX);
        data.push($(event.target).position().top - event.originalEvent.clientY);
        event.originalEvent.dataTransfer.setData("text/html", data.join(','));
    },

    _onDragOver: function(event) {
        event.originalEvent.preventDefault();
        var data = event.originalEvent.dataTransfer.getData("text/html").split(',');
        
        if (data[0] == 'pan') {
            Crezy.canvas.pan(event.originalEvent.clientX - parseInt(data[1],10),
                event.originalEvent.clientY - parseInt(data[2],10), 0);
        }
        //event.originalEvent.stopPropagation();
        return false;
    },

    _onDrop: function(event) {
        var data = event.originalEvent.dataTransfer.getData("text/html").split(',');
        
        if (data[0] == 'pan') {
            console.log('panned', data);
        } else if (data[0].indexOf('resize') == 0) {
            Crezy.elementToolbar._onResize(data, event);
        } else if (data[0] == 'move') {
            Crezy.presentation.elements(data[1])
                .x(event.originalEvent.clientX + parseInt(data[2],10))
                .y(event.originalEvent.clientY + parseInt(data[3],10));
            event.originalEvent.preventDefault();
        }
        //event.originalEvent.stopPropagation();
        return false;
    },
    
    pan: function(x,y,z) {
        this._pan = [x||0,y||0,z||0];
        this._ui.css('transform', 'scale('+this._scale+')translate3d('+this._pan.join('px,')+'px)');
    }
};

Crezy.elementToolbar = {

    _init: function () {
        this._ui = $('#toolbar-container');
        Crezy.canvas._ui.on('mouseenter', '.element,#toolbar-container', this.show);
        this._ui.mouseleave(this.hide)
            .find('[data-action^="resize-"]').bind('dragstart', this._dragStart);
    },
    
    _dragStart: function(event) {
        var data = [];
        data.push($(this).data('action'));
        data.push(this.id);
        data.push(event.originalEvent.clientX);
        data.push(event.originalEvent.clientY);
        event.originalEvent.dataTransfer.setData("text/html", data.join(','));
    },
    
    _onResize: function(data, event) {
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
        default: console.log(data[0]+' not supported'); break;
        }
    },
    
    resizeN: function(elem, h) {
        elem.height('-='+h);
        elem.y('+='+h);
    },
    resizeS: function(elem, h) {
        elem.height('+='+h);
    },
    resizeE: function(elem, w) {
        elem.width('+='+w);
    },
    resizeW: function(elem, w) {
        elem.width('-='+w);
        elem.x('+='+w);
    },
    
    show: function() {
        if (this.classList.contains('element')) {
            Crezy.currentSlide = Crezy.presentation.slides[$(this).parent('.step')[0].id];
            Crezy.currentElement = Crezy.currentSlide.elements[this.id];
        }
        var elem = $(this),
            pos = elem.position(),
            css = {top: pos.top, left: pos.left, width: elem.width(), height: elem.height()};
        Crezy.elementToolbar._ui.css(css).show();
    },
    
    hide: function() {
        Crezy.elementToolbar._ui.hide();
    }
};

var pfx = (function () {        
    var style = document.createElement('dummy').style,
        prefixes = 'Webkit Moz O ms Khtml'.split(' '),
        memory = {};

    return function ( prop ) {
        if ( typeof memory[ prop ] === "undefined" ) {
            
            var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
                props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
            
            memory[ prop ] = null;
            for ( var i in props ) {
                if ( style[ props[i] ] !== undefined ) {
                    memory[ prop ] = props[i];
                    break;
                }
            }
        
        }
        
        return memory[ prop ];
    };

})();

var ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function makeId(len) {
    if (!len) len = 5;
    var text = "";
    
    for( var i=0; i < len; i++ ) {
        text += ID_ALPHABET.charAt(Math.floor(Math.random() * ID_ALPHABET.length));
    }
    return text;
}
