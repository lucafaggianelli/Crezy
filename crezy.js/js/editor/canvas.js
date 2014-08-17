goog.provide('Crezy.Editor.Canvas');

Crezy.Editor.Canvas = function() {
    this.selectBox = new createjs.Container();
    this.selectBox.visible = false;
    this.corners = [];
    this.isPanning = false;
    this.isDragging = false;
    
    for (i=0;i<4;i++) {
        this.corners.push(new createjs.Shape());
        this.corners[i].graphics.s("#FFFFFF").f("#2C68E7")
            .dr(0,0,10,10);
        this.selectBox.addChild(this.corners[i]);
    }
    this.border = new createjs.Shape();
    this.selectBox.addChild(this.border);
    Crezy.ui.stage.addChild(this.selectBox);
}

Crezy.Editor.Canvas.prototype.draw = function() {
    Crezy.ui.stage.on('click', this.selectElement, this);
    
    // Drag an element
    Crezy.ui.stage.on('pressmove', function(evt) {
        evt.target.x = (evt.stageX - Crezy.ui.stage.x) / Crezy.ui.stage.scaleX;
        evt.target.y = (evt.stageY - Crezy.ui.stage.y) / Crezy.ui.stage.scaleY;
    }, this);
    Crezy.ui.stage.on('pressup', this.moveElementEnd, this);
    // this only fires when clicking an element
    Crezy.ui.stage.on('mousedown', function() {
        this.isPanning = false;
    }, this);

    Crezy.ui.stage.on('stagemousemove', this.panCanvas, this);

    Crezy.ui.stage.on('stagemousedown', this.stageDown, this);
    Crezy.ui.stage.on('stagemouseup', function() {
        this.isDragging = false;
        this.isPanning = false;
    }, this);
};

Crezy.Editor.Canvas.prototype.stageDown = function(evt, data) {
    this.isDragging = true;

    // Drag on stage fires before drag on element
    this.isPanning = true;
    this.panX = evt.rawX - Crezy.ui.stage.x;
    this.panY = evt.rawY - Crezy.ui.stage.y;
};

Crezy.Editor.Canvas.prototype.panCanvas = function(evt, data) {
    if (!this.isDragging || !this.isPanning) return;
    
    Crezy.ui.stage.x = evt.rawX - this.panX;
    Crezy.ui.stage.y = evt.rawY - this.panY;
}

Crezy.Editor.Canvas.prototype.moveElementEnd = function(evt, data) {
    console.log('move end');
    var elem = Crezy.presentation.json.elements[evt.target.name];
    elem.x = evt.target.x;
    elem.y = evt.target.y;
}

Crezy.Editor.Canvas.prototype.selectElement = function(evt, data) {
    var elem = evt.target;
    var box = elem.getBounds();
    box.width  = box.width * Crezy.ui.stage.scaleX;
    box.height = box.height * Crezy.ui.stage.scaleY;

    this.selectBox.regX = box.width/2;
    this.selectBox.regY = box.height/2;
    this.selectBox.x = elem.x;
    this.selectBox.y = elem.y;
    this.border.graphics.c().s("#2C68E7")
        .dr(5,5, box.width-10, box.height-10);
    this.corners[0].x = 0;
    this.corners[0].y = 0;
    this.corners[1].x = box.width-10;
    this.corners[1].y = 0;
    this.corners[2].x = 0;
    this.corners[2].y = box.height-10;
    this.corners[3].x = box.width-10;
    this.corners[3].y = box.height-10;
 
    this.selectBox.scaleX = 1/Crezy.ui.stage.scaleX;
    this.selectBox.scaleY = 1/Crezy.ui.stage.scaleY;

    Crezy.ui.stage.setChildIndex(this.selectBox, Crezy.ui.stage.getNumChildren()-1);
    this.selectBox.visible = true;
};
