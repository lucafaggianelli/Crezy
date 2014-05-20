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
