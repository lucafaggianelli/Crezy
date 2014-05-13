goog.provide('Crezy.Element');

Crezy.Element = function(args) {
    var json = {};
    $.extend(json, {id: makeId(), position: [0,0], size: ['auto','auto'], style: {}}, args);
    
    this.id = json.id;
    this.type = json.type;
    this.position = [json.position[0], json.position[1]];
    this.size = [json.size[0], json.size[1]];

    this.style = json.style;
    
    this.ui = null;

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

    this.projectedHeight = function() {
        var A = this.position[0];
        var B = this.size[0];

        // new coordinates
        A = calc(A, 35*Math.PI/180, 300);
        B = calc(B, 35*Math.PI/180, 300);
        // translate back
        A += (this.size[0])/2;
        B += (this.size[0])/2;
        if(B < A) { var tmp = A; A = B; B = tmp; } // swap

        return B-A;
    };

    this._draw = function(html, parent) {
        var css = {
            width: this.size[0], height: this.size[1],
            left: this.position[0], top: this.position[1]};
        $.extend(css, this.style);
        
        this.ui = $('<div id="'+this.id+'" type="'+this.type+'">'+html+'</div>')
            .addClass('element').attr('draggable', 'true')
            .css(css)
            .appendTo(parent);
    };
    
    this._animate = function(animate, duration, steps) {
        var _this = this, i = 0, delta;

        if (isFinite(duration) && isFinite(steps)) {
            delta = Math.round(duration/steps);
        } else if (isFinite(duration)) {
            delta = parseInt(duration);
        } else {
            throw 'Duration and steps must be integers!';
            return false;
        }
        
        var interval = setInterval(function() {
                if (animate.call(_this, ++i) === false) clearInterval(interval);
                if (i >= steps) clearInterval(interval);
            }, delta);
    };
}

Crezy.TextEditor = function(args) {
    args = args || {};
    this.type = 'Text';
    
    this.text = args.text || '';
    this.style = args.style || {};
    
    this.draw = function(parent) {
        this._draw('<input type="text" value="'+this.text+'"/>', parent);
    };
    
    this.height = function(set) {
        this._height(set).ui.css('font-size', set);
    };

    this.save = function() {
        return this._save(['text']);
    };
}
Crezy.TextEditor.prototype = new Crezy.Element;

Crezy.Text = function(args) {
    args = args || {};
    this.type = 'Text';
    
    this.text = args.text || '';
    this.style = args.style || {};
    
    this.draw = function(parent) {
        this._draw('<p>'+this.text+'</p>');
    };
    
    this.height = function(set) {
        this._height(set).ui.css('font-size', set);
    };
    
    this.animate = function() {
        this._animate(function(step) {
            this.ui.html(this.text.slice(0, step));
        }, 5000, this.text.length);
    };

    this.save = function() {
        return this._save(['text']);
    };
}
Crezy.Text.prototype = new Crezy.Element;

function calc(oldx, angle, p) {
    var x = Math.cos(angle) * oldx;
    var z = Math.sin(angle) * oldx;

    return x * p / (p+z);
}

var RE_CSS_ROTATE = new RegExp(/rotate([A-Z])\((-*[0-9]+)deg\)/);
