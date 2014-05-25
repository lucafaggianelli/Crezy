goog.provide('Crezy.Slide');

Crezy.Slide = function (o) {
    var opts = {id:Crezy.utils.makeId(),x:0,y:0,z:0,elements:[],scale:1,
        rotate:0,'rotate-x':0,'rotate-y':0,'rotate-z':0};
    $.extend(opts, o);
    
    this.id = opts.id;
    this.title = opts.title;
    this.description = opts.description;
    
    this.x = opts.x;
    this.y = opts.y;
    this.z = opts.z;
    this.scale = opts.scale;
    this.width = opts.width;
    this.height = opts.height;
    this.rotate = {
        x: opts['rotate-x'],
        y: opts['rotate-y'],
        z: opts['rotate-z'] || opts.rotate};

    // Init elements
    this.elementsCount = 0;
    this.elements = {};
    var _this;
    for (var i in opts.elements) {
        _this = opts.elements[i];
        _this.id = _this.id || 'elem-'+this.id+'-'+i;
        this.elements[_this.id] = Crezy.Element.newInstance(opts.elements[i]);
        this.elementsCount++;
    }; delete _this;
};

Crezy.Slide.prototype.edit = function() {
    this.ui = $('<div id="'+this.id+'" class="step edit">');
    this.ui.attr({
        'data-x': this.x,
        'data-y': this.y,
        'data-z': this.z,
        'data-scale': this.scale,
        'data-rotate-x': this.rotate.x,
        'data-rotate-y': this.rotate.y,
        'data-rotate-z': this.rotate.z
    })
    this.ui.css({
        transform: 'translate(-50%,-50%)translate3d('+this.x+'px,'+this.y+'px,'+this.z+'px)'+
            'scale('+this.scale+')rotateX('+this.rotate.x+'deg)'+
            'rotateY('+this.rotate.y+'deg)rotateZ('+this.rotate.z+'deg)',
        'transform-style': 'preserve-3d'
    });
    
    // Create inner elements
    var elem;
    for (var i in this.elements) {
        this.ui.append(this.elements[i].draw());
    }
    return this.ui;
}

Crezy.Slide.prototype.draw = function() {
    // Create container element
    this.ui = $('<div id="'+this.id+'" class="step">');
    this.ui.attr({
        'data-x': this.x,
        'data-y': this.y,
        'data-z': this.z,
        'data-scale': this.scale,
        'data-rotate-x': this.rotate.x,
        'data-rotate-y': this.rotate.y,
        'data-rotate-z': this.rotate.z
    });
    
    // Create inner elements
    var elem;
    for (var i in this.elements) {
        elem = Crezy.Element.newInstance(this.elements[i]);
        this.ui.append(elem.draw());
    }
    
    return this.ui;
};
