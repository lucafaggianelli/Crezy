goog.provide('Crezy.Element');

Crezy.Element = function(args) {
    var json = {id: Crezy.utils.makeId(), position: [0,0], size: ['auto','auto'], style: {}};
    $.extend(json,args);
    
    this.id = json.id;
    this.type = json.type;
    this.position = [json.position[0], json.position[1]];
    this.size = [json.size[0], json.size[1]];
    this.content = json.content || '';

    this.style = json.style;

    this._toSave = ['id','type','position','size','style'];
    this._save = function(props) {
        // Update params
        this.position = [this.ui.position().left, this.ui.position().top];
        this.size = [this.ui.width(), this.ui.height()];
        
        var toStringify = {}, _this = this;
        this._toSave.concat(props).forEach(function(p) {
            toStringify[p] = _this[p];
        });
        return JSON.stringify(toStringify);
    };
    
    this._x = this.x = function(set) {
        if (!set) return this.ui.css('left');
        else this.ui.css('left',set); return this;
    };
    this._y = this.y = function(set) {
        if (!set) return this.ui.css('top');
        else this.ui.css('top',set); return this;
    };
    this._width = this.width = function(set) {
        if (!set) return this.ui.width();
        else this.ui.width(set); return this;
    };
    this._height = this.height = function(set) {
        if (!set) return this.ui.height();
        else this.ui.height(set); return this;
    };

    this.rotate = function(axis, angle) {
        var css, done = false, increment = false;
        axis = axis.toUpperCase();
        
        if (angle instanceof String || typeof angle == 'string') {
            console.log('String found');
            var tmp = angle.split('=');
            angle = parseInt(tmp[1]);
            angle *= (tmp[0] == '-') ? -1 : +1;
            console.log('Incrementing of:',angle);
            increment = true;
        }
        
        if (this.style && this.style.transform) {
            var trans = this.style.transform.split(' ');
            var m;
            for (var i in trans) {
                if (!(m = trans[i].match(RE_CSS_ROTATE))) continue;
                if (m[1] == axis) {
                    console.log('Got rotate:',m );
                    if (increment) angle += parseInt(m[2]);
                    trans[i] = 'rotate'+axis+'('+angle+'deg)';
                    done = true;
                    break;
                }
            }
            if (!done) {
                trans.push('rotate'+axis+'('+angle+'deg)');
            }
            this.style.transform = trans.join(' ');
            css = {transform: this.style.transform};
        } else {
            this.style.transform = 'perspective(400px) rotate'+axis+'('+angle+'deg)';
            css = {transform: this.style.transform};
        }
        $.extend(this.style, css);
        this.ui.css(css);
    }
    this.rotateX = function(angle) { return this.rotate('x', angle) };
    this.rotateY = function(angle) { return this.rotate('y', angle) };
    this.rotateZ = function(angle) { return this.rotate('z', angle) };
}

Crezy.Element.prototype.draw = function() {}
Crezy.Element.prototype.edit = function() {}

Crezy.Element.newInstance = function(json) {
    if (Crezy.Element._available.hasOwnProperty(json.type) &&
        Crezy.Element._available[json.type] instanceof Function)
    return new Crezy.Element._available[json.type](json);
}

Crezy.Element._available = {};

goog.require('Crezy.Text');
goog.require('Crezy.Image');
