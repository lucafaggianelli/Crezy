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
    
    if (!Crezy.presentation || step == undefined || step == null) return;
        
    var dict = {
        next: Crezy.presentation.getCurrentStep() + 1,
        prev: Crezy.presentation.getCurrentStep() - 1,
        first: 0,
        last: Crezy.presentation.stepsCount-1};

    var stepInt = NaN;
    if (dict.hasOwnProperty(step)) {
        stepInt = dict[step];
        console.log('Step kw:',step,stepInt);
        //if (step < 0) step = 0;
        //else if (step >= Crezy.presentation.stepsCount) step = Crezy.presentation.stepsCount-1;
    } else {
        stepInt = parseInt(step);
        console.log('Parsed int',stepInt);
    }

    if (isFinite(stepInt) && (stepInt>=0) && (stepInt<Crezy.presentation.stepsCount)) {
        // OK
    } else {
        throw "Step ID not valid: " + step;
    }

    var e = this.elements[stepInt];
    Crezy.presentation.currentStep = stepInt;

    createjs.Tween.get(Crezy.ui.stage)
        .to({
            x: window.innerWidth/2 - e.x/e.scale,
            y: window.innerHeight/2 - e.y/e.scale,
            scaleX: 1/e.scale,
            scaleY: 1/e.scale
        },1000, createjs.Ease.quadInOut)

        .call(function() {
            if (e.animations.length > 0) {
                var anim = e.animations[0];
                Crezy.Animations[anim.animation](e,anim.duration);
            }
        });

    createjs.Tween.get(Crezy.ui.stageBkg).to({
        x: (window.innerWidth/2 - e.x/e.scale)/10,
        y: (window.innerHeight/2 - e.y/e.scale)/10,
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
