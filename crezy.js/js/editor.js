goog.provide('Crezy.Editor');

goog.require('Crezy');

goog.require('Crezy.Editor.Canvas');
goog.require('Crezy.Editor.Grid');
goog.require('Crezy.Editor.KeyListener');
goog.require('Crezy.Editor.Toolbar');

goog.require('Crezy.Element');
goog.require('Crezy.Slide');
goog.require('Crezy.Presentation');

window.onload = function() {
    Crezy.init();
    Crezy.editor = new Crezy.Editor();
    enableAjaxSave();
}

/*
 *   [Grid] [Canvas] [Toolbars] [User]
 * --------------o---------------------> Z
 */
Crezy.Editor = function() {
    Crezy.currentElement = null;
    
    // Grid is behind everything
    Crezy.grid = new Crezy.Editor.Grid();
    Crezy.grid.draw();
    
    // Canvas is in front of grid and contains only the slides
    Crezy.canvas = new Crezy.Editor.Canvas();
    Crezy.canvas.draw();
    
    // The toolbar is in front of the canvas but is not contained in it    
    Crezy.toolbar = new Crezy.Editor.Toolbar();
    Crezy.toolbar.draw();

    //Crezy.keyListener = new Crezy.Editor.KeyListener();
    
    /** Bind listeners **/
    
    this.ui = $('#canvas')
        .on('dragstart', '.element', this._onDragStart)
        .on('click', '.element', function() {
            Crezy.currentSlide = Crezy.presentation.slides[$(this).parent('.step')[0].id];
            Crezy.currentElement = Crezy.currentSlide.elements[this.id];
            Crezy.toolbar.attachTo(Crezy.currentElement);
        })
        .bind('dragover', this._onDragOver)
        .bind('drop', this._onDrop);
    
    $('#sidebar li').click(function(event) {
        switch(this.id) {
            case 'load':
                Crezy.loadPresentation();
                break;
            case 'save':
                Crezy.savePresentation();
            case 'new-slide':
                var slide = new Crezy.Slide();
                slide.draw();
                Crezy.presentation.slides[slide.id] = slide;
                Crezy.currentSlide = slide;
                break;
            case 'new-text':
                var el = new Crezy.TextEditor();
                el.draw(Crezy.currentSlide.ui);
                Crezy.currentSlide.elements.push(el);
                Crezy.currentElement = el;
            default: break;
        }
    });
};

function enableAjaxSave() {
$.ajaxSetup({ 
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                 if (cookie.substring(0, name.length + 1) == (name + '=')) {
                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                     break;
                 }
             }
         }
         return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     } 
});
}
