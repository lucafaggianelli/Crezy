goog.provide('Crezy.utils');

var ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
Crezy.utils.makeId = function(len) {
    if (!len) len = 8;
    var text = "";
    
    for( var i=0; i < len; i++ ) {
        text += ID_ALPHABET.charAt(Math.floor(Math.random() * ID_ALPHABET.length));
    }
    return text;
}

Crezy.utils.prefix = (function () {
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
