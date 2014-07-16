goog.provide('Crezy.Ui');

Crezy.Ui = function() {
    this.logo = null;

    // Canvas elements
    this.canvas = $('#crezy-canvas')[0];
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.stage = new createjs.Stage(this.canvas);
    createjs.Ticker.addEventListener("tick", this.stage);
    createjs.Ticker.setFPS(50);
    
    if (false) {
        this.logo = $('<div id="logo"></div>');
        this.logo.appendTo(document.body);
    }
    
    if (true) {
        this.seekbar = new Crezy.Ui.Seekbar();
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
