goog.provide('Crezy.Text');

goog.require('Crezy.Element');

Crezy.Text = function(args) {
    goog.base(this,args);
}
goog.inherits(Crezy.Text, Crezy.Element);

Crezy.Text.prototype.edit = function() {
    this.ui = $('<input type="text" class="element edit" data-type="text" value="'+this.content+'"/>');
    return this.ui;
};

Crezy.Text.prototype.draw = function() {
    this.ui = $('<p id="'+this.id+'" class="element" data-type="text">' + this.content + '</p>');
    return this.ui;
};

Crezy.Element._available.text = Crezy.Text;
