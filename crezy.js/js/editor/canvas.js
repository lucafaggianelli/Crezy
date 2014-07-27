goog.provide('Crezy.Editor.Canvas');

Crezy.Editor.Canvas = function() {
    this.selectBox = new createjs.Shape();
    this.selectBox.visible = false;
    this.selectBox.shadow = new createjs.Shadow('#4682B4',0,0,3);
    this.selectBox.graphics.beginStroke("#FFFFFF")
        .drawRect(0, 0, 0, 0);
    Crezy.ui.stage.addChild(this.selectBox);
}

Crezy.Editor.Canvas.prototype.draw = function() {
    Crezy.ui.stage.on('click', this.selectElement, this);
    Crezy.ui.stage.on('pressmove', this.moveElement, this);
    Crezy.ui.stage.on('pressup', this.moveElementEnd, this);
};

Crezy.Editor.Canvas.prototype.moveElement = function(evt, data) {
    //var corrX = evt.target.regX*evt.target.scaleX + (evt.stageX - evt.target.x);
    //var corrY = evt.target.regY*evt.target.scaleY + (evt.stageY - evt.target.y);
    //console.log(corrX,corrY)

    evt.target.x = (evt.stageX) / Crezy.ui.stage.scaleX - Crezy.ui.stage.x;
    evt.target.y = (evt.stageY) / Crezy.ui.stage.scaleY - Crezy.ui.stage.y;
}

Crezy.Editor.Canvas.prototype.moveElementEnd = function(evt, data) {
    console.log(evt.target.x,evt.target.y,Crezy.presentation.json.elements[evt.target.name]);
}

Crezy.Editor.Canvas.prototype.selectElement = function(evt, data) {
    var elem = evt.target;
    var box = elem.getBounds();
    box.width  = box.width * elem.scaleX;
    box.height = box.height * elem.scaleY;

    this.selectBox.regX = box.width/2;
    this.selectBox.regY = box.height/2;
    this.selectBox.graphics.c().s("#FFFFFF")
        .dr(elem.x, elem.y, box.width, box.height);
    Crezy.ui.stage.setChildIndex(this.selectBox, Crezy.ui.stage.getNumChildren()-1);
    this.selectBox.visible = true;
};
