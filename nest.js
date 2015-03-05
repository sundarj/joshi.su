(function(document, undefined) {
    this.nest = {};
    /* stolen from _ */
    nest.has = function(obj, key) {
        return obj != null && ({}).hasOwnProperty.call(obj, key);
    };
    
    function extendDOM(el) {
        el.addClass = function(dot) {
            if (el.classList)
                el.classList.add(dot);
            else
                el.classList += (el.classList.indexOf(dot) != -1 ? dot : '');
            return el;
            }
        el.removeClass = function(dot) {
            if (el.classList)
                el.classList.remove(dot);
            else
                el.className = el.className.replace(dot, '');
            return el;
        }
    };
    
    nest.qs = function(sel, cb, pad) {
        var d;
        if (typeof sel === 'object') {
            d = sel;
            sel = cb;
            cb = pad;
        } else {
            d = window.document;   
        }
        if (cb == undefined) {
            var elem = [].slice.call(d.querySelectorAll(sel));
            elem.map(extendDOM);
            return elem.length === 1 ? elem[0] : elem;
        }
        var t = (''+cb).match(/\([a-z]+\)/)[0].replace(/[\(\)]/g,'');
        [].forEach.call(d.querySelectorAll(sel), function(el) {
            el.addEventListener(t, cb);
        });
    };
    
    HTMLElement.prototype.qs = function(sel, cb) {
        return nest.qs(this, sel, cb);
    };
    
    EventTarget.prototype.listen = function(evt, lst, cpt) {
        var self = this;
        [].map.call(''.split.call(evt, ','), function(e) {
            self.addEventListener(e, lst, cpt);
        });
    };

    EventTarget.prototype.delegate = function(evt, sel, lst, cpt) {
        this.listen(evt, function(e) {
            if (e.target && e.target.nodeName === sel.toUpperCase())
                lst.call(e.target, e);
        }, cpt);
    };
    
})(document)