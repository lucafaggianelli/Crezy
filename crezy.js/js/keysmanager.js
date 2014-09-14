goog.provide('Crezy.KeysManager');

goog.require('Crezy.Keycode');

Crezy.KeysManager = function() {
    $(document).keydown(this._onKeyPress);
};

Crezy.KeysManager.prototype._onKeyPress = function(event) {

    switch(event.which) {
        case Crezy.Keycode.LEFT:
        case Crezy.Keycode.UP:
            Crezy.presentation.setCurrentStep('prev');
            break;

        case Crezy.Keycode.RIGHT:
        case Crezy.Keycode.DOWN:
        case Crezy.Keycode.SPACE:
            Crezy.presentation.setCurrentStep('next');
            break;

        default: break;
    }
};
