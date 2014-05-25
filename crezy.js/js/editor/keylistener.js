goog.provide('Crezy.Editor.KeyListener');

Crezy.Editor.KeyListener = function() {

    $(document).keydown(this._onKeyPress);
};

Crezy.Editor.KeyListener.prototype._onKeyPress = function(event) {

    var k = event.which >= 65 ? String.fromCharCode(event.which).toLowerCase() : event.which;

    switch(k) {
    // left, up, right, down
    case 37: Crezy.currentElement.x('-=5'); break;
    case 38: Crezy.currentElement.y('-=5'); break;
    case 39: Crezy.currentElement.x('+=5'); break;
    case 40: Crezy.currentElement.y('+=5'); break;
    
    case 'w': // 87
        Crezy.currentElement.rotateX('+=5');
        break;
    case 's': // 83
        Crezy.currentElement.rotateX('-=5');
        break;
    case 'a': // 65
        Crezy.currentElement.rotateY('-=5');
        break;
    case 'd': // 68
        Crezy.currentElement.rotateY('+=5');
        break;
    case 'q': // 81
        Crezy.currentElement.rotateZ('-=5');
        break;
    case 'e': // 69
        Crezy.currentElement.rotateZ('+=5');
        break;
        
    default: break;
    }
};
