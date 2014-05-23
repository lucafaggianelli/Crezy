goog.provide('Crezy.Ui');

Crezy.Ui = function() {
    fallback = "\
<p>Your browser <b>doesn't support the features required</b> by impress.js, so you are presented with a simplified version of this presentation.</p>\
<p>For the best experience please use the latest <b>Chrome</b>, <b>Safari</b> or <b>Firefox</b> browser.</p>'
    hint = "<p>Use a spacebar or arrow keys to navigate</p>"

    this.logo = null;

    // Impress elements
    this.canvas = $('#impress');
    $('<div class="fallback-message"></div>').html(fallback).appendTo(document.body);
    $('<div class="hint"></div>').html(hint).appendTo(document.body);
    
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
