goog.provide('Crezy');

goog.require('Crezy.utils');
goog.require('Crezy.Ui');
goog.require('Crezy.Background');
goog.require('Crezy.Slide');
goog.require('Crezy.Element');
goog.require('Crezy.Presentation');
goog.require('Crezy.Remote');
goog.require('Crezy.Animations');
goog.require('Crezy.KeysManager');

Crezy.init = function() {
    Crezy.ui = new Crezy.Ui();
    Crezy.background = new Crezy.Background();
    Crezy.keysManager = new Crezy.KeysManager();
};

Crezy.loadPresentation = function(id, callback) {
    
    Crezy.preload = new createjs.LoadQueue(false, '/static/presentations/'+id+'/');
    Crezy.preload.on("fileload", onFileLoad,this);
    Crezy.preload.on("progress", onFileProgress,this);
    Crezy.preload.on("complete", onLoadComplete,this);
    Crezy.preload.on("error", onLoadError,this);

    Crezy.getPresentation(id, function(pres) {
        Crezy.presentation = new Crezy.Presentation(pres);
        document.title = "Crezy | " + Crezy.presentation.title;

        Crezy.preload.loadManifest(Crezy.presentation.resources);

        if (callback instanceof Function) callback.call(null);
    });
};

Crezy.getPresentation = function(id, callback, context) {
    if (!id) throw 'Provide a presentation id';
    context = context || null;
    
    $.get('/static/presentations/'+id+'.json', function(data) {
            if (callback instanceof Function) callback.call(context, data);
        },'json')
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
};

function onFileLoad(event) {
    console.log("A file has loaded of type: " + event.item.type);
}
 
function onLoadError(evt) {
    console.log("Error!",evt.text);
}

function onFileProgress(event) {
    console.log((Crezy.preload.progress*100|0) + " % Loaded");
    //stage.updateProgress();
}
 
function onLoadComplete(event) {
    console.log("Finished Loading Assets");
    
    // Draw background
    var b = Crezy.presentation.backgrounds[1];
    var img = new createjs.Bitmap(Crezy.preload.getResult(b.id));
    
    var box = img.getBounds();
    img.regX = box.width / 2;
    img.regY = box.height / 2;
    img.x = window.innerWidth / 2;
    img.y = window.innerHeight / 2;

    var s = Math.max(window.innerWidth/box.width, window.innerHeight/box.height);
    img.scaleX = img.scaleY = s;

    //for (var i in Crezy.presentation.background) {
        Crezy.ui.stageBkg.addChild(img);
    //}
    Crezy.ui.stageBkg.update();

    for (var i in Crezy.presentation.elements) {
        Crezy.ui.stage.addChild(Crezy.presentation.elements[i].draw());
    }
}

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
