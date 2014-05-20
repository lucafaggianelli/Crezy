goog.provide('Crezy.Text');

goog.require('Crezy.Element');

Crezy.Text = function(args) {
    goog.base(this,args);
}
goog.inherits(Crezy.Text, Crezy.Element);

Crezy.Text.prototype.draw = function() {
    console.log(this);
    return '<p>' + this.content + '</p>';
};

available.text = Crezy.Text;
