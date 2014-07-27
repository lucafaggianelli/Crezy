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
