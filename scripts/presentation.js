goog.provide('Crezy.Presentation');

Crezy.Presentation = function(args) {
    var json = {};
    $.extend(json, {id: makeId(), title: "New presentation", author: 'me', description: 'No description'}, args);
    
    this.id = json.id;
    this.title = json.title;
    this.description = json.description;
    this.author = json.author;
    
    this.slides = {};
    
    this.elements = {};
        
    this.save = function() {
        var json = {};
        for(var i in this.elements) {
            json[i] = this.elements[i].save();
        }
        return json;
    };
    
    var _this;
    for (var i in json.elements) {
        _this = json.elements[i];
        if (!(_this.type in Crezy)) {
            throw 'Can\'t draw element ' + _this.type;
            continue;
        }
        this.elements[_this.id] = new Crezy[_this.type](_this);
    }; delete this._this;

    this.addElement = function(elem) {
        this.elements[elem.id] = elem;
        elem.draw();
    };
}
