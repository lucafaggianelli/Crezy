goog.provide('Crezy.Animations');

Crezy.Animations = function() {

}

Crezy.Animations.pulseIn = function(e,d) {
    d = d || 1000;
    var elem = e.ui;
    elem.scaleX = .4;
    elem.scaleY = .4;
    elem.alpha = 0;
    elem.visible = true

    createjs.Tween.get(elem).to(
        {scaleX:1,scaleY:1,alpha:1},d,
        createjs.Ease.getElasticOut(5,1));
}

Crezy.Animations.fadeTowards = function(e,d) {
    d = d || 1000;
    var elem = e.ui;
    elem.scaleX = 10;
    elem.scaleY = 10;
    elem.alpha = 0;
    elem.visible = true

    createjs.Tween.get(elem,{override:true}).to(
        {scaleX:1,scaleY:1,alpha:1},d,
        createjs.Ease.circOut);
}

Crezy.Animations.fadeAway = function(e,d) {
    d = d || 1000;
    var elem = e.ui;
    elem.scaleX = 1;
    elem.scaleY = 1;
    elem.alpha = 1;
    elem.visible = true

    createjs.Tween.get(elem,{override:true}).to(
        {scaleX:10,scaleY:10,alpha:0},d,
        createjs.Ease.circIn);
}
