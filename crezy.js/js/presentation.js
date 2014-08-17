goog.provide('Crezy.Presentation');

goog.require('Crezy.utils');

Crezy.Presentation = function(pres) {
    if (!pres.id) throw 'No ID in the presentation';
    this.json = JSON.parse(JSON.stringify(pres));
    var args = {resources:{}, style:{}};
    $.extend(args, pres);
    
    this.id = args.id;
    this.title = args.title;
    this.description = args.description;
    this.author = args.author;
    
    this.settings = {};
    this.style = args.style;
    this.backgrounds = args.backgrounds;
    this.resources = args.resources;

    this.elements = {};
    this.stepsCount = 0;
    this.currentStep = -1;
    var elem;
    for (var i in args.elements) {
        elem = Crezy.Element.newInstance(args.elements[i]);
        this.elements[i] = elem;
        this.stepsCount++;
    };delete elem;
    this.json.stepsCount = this.stepsCount;
}

Crezy.Presentation.prototype.getCurrentStep = function() {
    if (this.currentStep == null || this.currentStep == undefined)
        this.currentStep = -1;

    return this.currentStep;
}

Crezy.Presentation.prototype.setCurrentStep = function(step) {
    var e = this.elements[step];
    Crezy.presentation.currentStep = step;

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
