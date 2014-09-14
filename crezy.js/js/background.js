goog.provide('Crezy.Background');

Crezy.Background = function(args) {
    for (var i in Crezy.presentation.backgrounds) {
        this.draw(Crezy.presentation.backgrounds[i]);
    }
}

Crezy.Background.prototype.draw = function(args) {
    switch(args.type) {
    case 'gradient':
        var w = window.innerWidth;
        var h = window.innerHeight;
        var grad = new createjs.Shape();
        grad.regX = w/2;
        grad.regY = h/2;
        grad.graphics.beginLinearGradientFill(args.colors, args.levels,0,0,0,h)
            .dr(0,0,w,h);
        grad.x = w/2;
        grad.y = h/2;
        Crezy.ui.stageBkg.addChild(grad);
    }
}
