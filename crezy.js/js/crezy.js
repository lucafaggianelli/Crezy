goog.provide('Crezy');

goog.require('Crezy.utils');
goog.require('Crezy.Ui');
goog.require('Crezy.Slide');
goog.require('Crezy.Element');
goog.require('Crezy.Presentation');

window.onload = function() {
    Crezy.impress = impress();
    Crezy.init();
};

Crezy.init = function() {
    Crezy.ui = new Crezy.Ui();
    
    document.addEventListener('impress:init', Crezy._onInit);
    document.addEventListener('impress:stepenter', Crezy._onStepEnter);
    document.addEventListener('impress:stepleave', Crezy._onStepLeave);
};

Crezy.loadPresentation = function(id) {
    
    Crezy.getPresentation(id, function() {
        Crezy.presentation = this;
        document.title = Crezy.presentation.title;

        Crezy.drawSlides(Crezy.presentation.slides);
        Crezy.impress.init();
    });
};

Crezy.getPresentation = function(id,callback) {
    if (!id) throw 'Provide a presentation id';
    
    $.get('/static/presentations/'+id+'.json', function(data) {
        if (callback instanceof Function) callback.call(data);
    },
    'json');
};

Crezy.drawSlides = function(slides) {
    var slide, step;
    for (var i=0; i<slides.length; i++) {
        slide = new Crezy.Slide(slides[i]);
        Crezy.ui.canvas.append(slide.draw());
    }
};

Crezy.updateProgress = function(p) {
    this.ui.seekbar.set(p * 100);
}

// Events handling

Crezy._onInit = function(event) {
    var steps = document.querySelectorAll('.step');
    Crezy.stepsCount = steps.length;
    Crezy.transitionDuration = document.querySelector('#impress').dataset.transitionDuration || 1000;

    for (var i=0; i<Crezy.stepsCount; i++) {
        var title = '<b>'+Crezy.presentation.slides[i].name+'</b>' + '<br/>'+ Crezy.presentation.slides[i].description||'';
        Crezy.ui.seekbar.addBookmark(title, i, 100 / Crezy.stepsCount);
    }
    
    Crezy.ui.seekbar.progressBar.css('transition', 
        'width ' + (Crezy.transitionDuration / 1000) + 's');
    
    for(var i=0; i<steps.length; i++) {
        steps[i].setAttribute('data-stepnumber', i+1);
    }
};

Crezy._onStepEnter = function(event) {
    console.log('Entered step', event.target.id);    

    var stepNum = parseInt(event.target.getAttribute('data-stepnumber'));
    if (!isNaN(stepNum)) Crezy.updateProgress(stepNum / Crezy.stepsCount);

    switch(event.target.id) {
    case 'where':
        break;
        var globe = event.target.getElementsByClassName('globe')[0];
        globe.style.backgroundPosition = '0px 0px';
        
        setInterval(function(){
            var pos = parseInt(globe.style.backgroundPosition.split(' ')[0].slice(0,-2));
            pos += 10;
            if (pos > 640) pos -= 640;
            globe.style.backgroundPosition = pos+'px 0px';
        }, 50);
        break;
    };
    
    if (!this.animations) return;
    this.animations[event.target.id];
};

Crezy._onStepLeave = function(event) {
    console.log('Left step', event.target.id);
    
    //var stepNum = parseInt(event.target.getAttribute('data-stepnumber'));
    var stepNum = parseInt(document.querySelector('.step.active').getAttribute('data-stepnumber'));
    if (!isNaN(stepNum)) Crezy.updateProgress(stepNum / Crezy.stepsCount);
};
