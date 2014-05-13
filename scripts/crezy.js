goog.provide('Crezy');

goog.require('Crezy.Slide');
goog.require('Crezy.Element');
goog.require('Crezy.Presentation');

window.onload = function() {
    Crezy.impress = impress();
    Crezy.init();
};

Crezy.init = function() {
    this.canvas = document.getElementById('impress');
    this.logo = document.getElementById('logo');
    this.progressBar = document.querySelector('#progress');
    this.bookmarksBar = document.querySelector('#bookmarks-container');
    
    document.addEventListener('impress:init', Crezy._onInit);
    document.addEventListener('impress:stepenter', Crezy._onStepEnter);
    document.addEventListener('impress:stepleave', Crezy._onStepLeave);
};

Crezy.loadPresentation = function(name) {
    
    this.presentation = this.getPresentation(name);
    document.title = this.presentation.title;
    this.logo.innerHTML = this.presentation.logo;
    
    this.drawSlides(this.presentation.slides);
    //this.drawElements(this.presentation.elements);
    Crezy.impress.init();
};

Crezy.getPresentation = function(name) {
    if (!name) return fakePresentation;
    else return window[name + 'Presentation'];
};

Crezy.drawSlides = function(slides) {
    var sl, step;
    for (var i=0; i<slides.length; i++) {
        sl = slides[i];
        
        step = document.createElement('div');
        step.id = sl.id || 'step'+i;
        step.className = 'step';
        //step.style = sl.style;
        step.dataset.x = sl.x || 0;
        step.dataset.y = sl.y || 0;
        step.dataset.z = sl.z || 0;
        step.dataset.scale = sl.scale || 1;
        if (sl.showAfter) {step.classList.add('show-after');}
        
        this.drawElements(sl.elements, step);
        
        this.canvas.appendChild(step);
    }
};

Crezy.drawElements = function(elems, root) {
    var el, content;
    for(var i=0; i<elems.length; i++) {
        el = elems[i];

        switch(el.type) {
        case 'img': content = Crezy.drawElementImage(el); break;
        case 'map': content = Crezy.drawElementMap(el); break;
        case 'chart': content = Crezy.drawElementChart(el); break;
        case 'text': content = Crezy.drawElementText(el); break;
        
        case 'html':
        default: content = Crezy.drawElementHtml(el); break;
        }
        if (typeof content == 'string') root.innerHTML += content;
        else {
            content.classList.add('element');
            if (el.x || el.y) content.style.position = 'absolute';
            if (el.x) content.style.left = el.x;
            if (el.y) content.style.top = el.y;
            if (el.showAfter) {content.classList.add('show-after');}
            root.appendChild(content);
        }
    }
};

Crezy.drawElementHtml = function(el) {
    return el.content;
};

Crezy.drawElementText = function(el) {
    if (!el.extra) {
        el.extra = 'p';
    }
    var content = document.createElement(el.extra);
    content.innerHTML = el.content;
    return content;
};

Crezy.drawElementImage = function(el) {
    var img = document.createElement('img');
    img.src = el.content;
    return img;
};

Crezy.drawElementChart = function(el) {
    var data = [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 17 }, { x: 3, y: 42 } ];
    var container = document.createElement('div');
    container.style.width = '600px';
    container.style.height = '400px';
    
    el.graph = new Rickshaw.Graph( {
        element: container,
        width: 600,
        height: 400,
        series: [{
            color: 'steelblue',
            data: data
        }]
    });

    el.graph.render();
    
    return container;
};

Crezy.drawElementMap = function(el) {
    
    var container = $('<div>');
    container.width(800).height(600);
    container.vectorMap({map: 'world_merc_en'});
    return container[0];
};

Crezy.updateProgress = function(p) {
    if (p < 0) p = 0;
    else if (p > 1) p = 1;
    Crezy.progressBar.style.width = (p * 100) +'%';
}

Crezy._onInit = function(event) {
    var steps = document.querySelectorAll('.step');
    Crezy.stepsCount = steps.length;

    var bm = document.createElement('div'), tmp;
    bm.className = 'bookmark';
    bm.dataset.toggle = 'tooltip'
    bm.placement = 'top';
    bm.style.width = (100/Crezy.stepsCount) + '%';
    for (var i=0; i<Crezy.stepsCount; i++) {
        tmp = bm.cloneNode(false);
        tmp.dataset.stepIndex = i;
        tmp.title = '<b>'+Crezy.presentation.slides[i].name+'</b>' + '<br/>'+ Crezy.presentation.slides[i].description||'';
        Crezy.bookmarksBar.appendChild(tmp);
    }
    $('.bookmark').click(function(event) {
        console.log('bookmark', this.dataset.stepIndex);
        Crezy.impress.goto(parseInt(this.dataset.stepIndex));
    }).tooltip({html: true});
    
    Crezy.transitionDuration = document.querySelector('#impress').dataset.transitionDuration || 1000;
    Crezy.progressBar.style[pfx('transition')] = 'width ' + (Crezy.transitionDuration / 1000) + 's';
    
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

var pfx = (function () {        
    var style = document.createElement('dummy').style,
        prefixes = 'Webkit Moz O ms Khtml'.split(' '),
        memory = {};

    return function ( prop ) {
        if ( typeof memory[ prop ] === "undefined" ) {
            
            var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
                props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
            
            memory[ prop ] = null;
            for ( var i in props ) {
                if ( style[ props[i] ] !== undefined ) {
                    memory[ prop ] = props[i];
                    break;
                }
            }
        
        }
        
        return memory[ prop ];
    };

})();
