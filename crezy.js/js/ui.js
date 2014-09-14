goog.provide('Crezy.Ui');

var pan = {
        mouseDown: false,
        dX:0, dY:0,
        offsetX:0, offsetY:0};

Crezy.Ui = function() {
    this.logo = null;

    // Main Canvas element
    this.canvas = $('#crezy-canvas')[0];
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.stage = new createjs.Stage(this.canvas);
    
    // Background Canvas element
    this.background = $('#crezy-background')[0];
    this.background.width = window.innerWidth;
    this.background.height = window.innerHeight;
    this.stageBkg = new createjs.Stage(this.background);

    createjs.Ticker.addEventListener("tick", this.stage);
    createjs.Ticker.addEventListener("tick", this.stageBkg);
    createjs.Ticker.setFPS(50);
    
    // Zoom and pan
    $(document.body).bind('mousewheel', _onMouseScroll)
    //this.canvas.onmousedown = this.onPanCanvasStart;
    //this.canvas.onmousemove = this.onPanCanvas;
    //document.onmouseup = this.onPanCanvasStop;
    
    if (false) {
        this.logo = $('<div id="logo"></div>');
        this.logo.appendTo(document.body);
    }
    
    if (true) {
        this.seekbar = new Crezy.Ui.Seekbar();
    }
}

function _onMouseScroll(event) {
    if (event.originalEvent.wheelDeltaY == 0) return;
    var zoomDir = event.originalEvent.wheelDeltaY > 0 ? 1.1 : 0.9;
    Crezy.ui.stage.scaleX = Crezy.ui.stage.scaleY = Crezy.ui.stage.scaleY * zoomDir;
}

Crezy.Ui.prototype.onPanCanvasStart = function(event) {
    // store current position to calc deltas
    pan.dX = event.clientX - Crezy.ui.stage.x;
    pan.dY = event.clientY - Crezy.ui.stage.y;
    pan.mouseDown = true;
}

Crezy.Ui.prototype.onPanCanvas = function(event) {
    // in a drag?
    if (pan.mouseDown === true) {
        // offset = current - original position
        pan.offsetX = event.clientX - pan.dX;
        pan.offsetY = event.clientY - pan.dY; 

        Crezy.ui.stage.x = pan.offsetX;
        Crezy.ui.stage.y = pan.offsetY;
    }
}

Crezy.Ui.prototype.onPanCanvasStop = function(event) {

    // was in a drag?
    if (pan.mouseDown === true) {
        // not any more!!!
        pan.mouseDown = false;

        // so we need to reset offsets as well
        pan.offsetX = pan.offsetY = 0;
    }
}

Crezy.Ui.Seekbar = function() {
    // Progress bar
    this.progressBarContainer = $('<div id="progress-container"></div>');
    this.progressBar = $('<div id="progress"></div><div id="progress-head"></div>');
    this.progressBarContainer.html(this.progressBar);
    this.progressBarContainer.appendTo(document.body);

    // Bookmarks bar
    this.bookmarksBar = $('<div id="bookmarks-container"></div>');
    this.bookmarksBar.appendTo(document.body);
    this.bookmarksBar.click(function(evt) {
        Crezy.impress.goto(parseInt(evt.target.dataset.stepIndex))
    });
}
Crezy.Ui.Seekbar.prototype.set = function(p) {
    if (p < 0) p = 0;
    else if (p > 100) p = 100;
    this.progressBar.css('width', p+'%');
}
Crezy.Ui.Seekbar.prototype.addBookmark = function(title,i,size) {
    var mark = $('<div class="bookmark" title="'+title+'" style="width:'+size+'%;" \
data-step-index="'+i+'" data-toggle="tooltip" data-placement="top"></div>');
    mark.tooltip({html: true});
    this.bookmarksBar.append(mark);
}
