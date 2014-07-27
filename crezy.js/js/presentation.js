goog.provide('Crezy.Presentation');

goog.require('Crezy.utils');

Crezy.Presentation = function(args) {
    if (!args.id) throw 'No ID in the presentation';
    this.json = {};
    $.extend(this.json, {resources:{}, style:{}}, args);
    
    this.id = args.id;
    this.title = args.title;
    this.description = args.description;
    this.author = args.author;
    
    this.settings = {};
    this.style = args.style;
    this.backgrounds = args.backgrounds;
    this.resources = args.resources;

    this.elements = {};
    var elem;
    for (var i in args.elements) {
        elem = Crezy.Element.newInstance(args.elements[i]);
        this.elements[i] = elem;
    };delete elem;

    // Init slides
    this.slidesCount = 0;
    this.slides = {};
    /*var _this;
    for (var i in json.slides) {
        _this = json.slides[i];
        _this.id = _this.id||'slide-'+i;
        this.slides[_this.id] = new Crezy.Slide(_this);
        this.slidesCount++;
    }; delete _this;*/
}

Crezy.Presentation.prototype.setFocusOnStep = function(step) {
    var e = this.elements[step];

    createjs.Tween.get(Crezy.ui.stage).to({
        x: window.innerWidth/2 - e.x/e.scale,
        y: window.innerHeight/2 - e.y/e.scale,
        scaleX: 1/e.scale,
        scaleY: 1/e.scale
    },1000, createjs.Ease.quadInOut);
}

Crezy.Presentation.prototype.save = function() {
    var json = {};
    for(var i in this.elements) {
        json[i] = this.elements[i].save();
    }
    return json;
};
