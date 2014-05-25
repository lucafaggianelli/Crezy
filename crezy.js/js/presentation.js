goog.provide('Crezy.Presentation');

goog.require('Crezy.utils');

Crezy.Presentation = function(args) {
    var json = {};
    $.extend(json, {id: Crezy.utils.makeId(), title: "New presentation", author: 'me', description: 'No description'}, args);
    
    this.id = json.id;
    this.title = json.title;
    this.description = json.description;
    this.author = json.author;
    
    this.settings = {};

    // Init slides
    this.slidesCount = 0;         
    this.slides = {};
    var _this;
    for (var i in json.slides) {
        _this = json.slides[i];
        _this.id = _this.id||'slide-'+i;
        this.slides[_this.id] = new Crezy.Slide(_this);
        this.slidesCount++;
    }; delete _this;
}

Crezy.Presentation.prototype.save = function() {
    var json = {};
    for(var i in this.elements) {
        json[i] = this.elements[i].save();
    }
    return json;
};
