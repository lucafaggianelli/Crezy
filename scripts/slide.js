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
    this.width = opts.width;
    this.height = opts.height;
    this.rotate = {
        x: opts['rotate-x'],
        y: opts['rotate-y'],
        z: opts['rotate-z'] || opts.rotate};
    
    this.elements = opts.elements;
    
    this.draw = function() {
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
            console.log('slide.js',elem,typeof elem)
            this.ui.append(elem.draw());
        }
        
        return this.ui;
    };
};
