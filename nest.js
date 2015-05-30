(function(document, undefined) {
    this.nest = {};
    this.nest._ = {};
    
    nest._.has = function(obj, key) {
        return obj != null && ({}).hasOwnProperty.call(obj, key);
    };
    
    nest._.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function() {
            var last = Date.now() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function() {
            context = this;
            args = arguments;
            timestamp = Date.now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    };
    
    nest.each = function(o, fn) {
        Object.keys(o).forEach(fn);
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
    
    nest.console = function(entry) {
        return {
            log: console.log.bind(console, entry),
            info: console.info.bind(console, entry),
            error: console.error.bind(console, entry)
        }
    }
    
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
        
        if (typeof lst === 'number') {
            return {
                then: function(fn) {
                    nest.oldval = self.value || self.textContent;
                    self.addEventListener(evt, nest._.debounce(fn, lst), cpt);
                }
            }
        };
        
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
    
    nest.key = function (keydir, context) {

        keydir = keydir || 'keydown';
        context = context || window;

        var mod;

        var upon = function (key) {
            return {
                upon: function (fn) {
                    context.addEventListener(keydir, function (e) {
                        if (e[mod]) {
                            if (String.fromCharCode(e.which) === key.toUpperCase()) {
                                e.preventDefault();
                                fn();
                            }
                        }
                    });
                }
            };
        };

        return {
            ctrl: function (key) {
                mod = 'ctrlKey';
                return upon(key);
            },
            alt: function(key) {
                mod = 'altKey';
                return upon(key);
            },
            shift: function(key) {
                mod = 'shiftKey';
                return upon(key);
            },
            raw: function(key) {
                mod = 'which';
                return upon(key);
            }
        };

    };
    
        EventTarget.prototype.key = function(keydir) {
            return nest.key(keydir, this)   
        }
        
        nest.keys = function(map, keydir) {
            nest.each(map, function(mod) {
                nest.each(map[mod], function(key) {
                    nest.key()[mod](key).upon(map[mod][key]); 
                });
            });
        }
        
    /*function r(method, file, data, fn, header) {
        if (typeof data === 'function') {
            header = fn;
            fn = data;
        }
        var req = new XMLHttpRequest();
        req.open(method, file, true);
        header = ({
            json: 'application/json',
            urlencoded: 'application/x-www-form-urlencoded',
            formdata: 'multipart/formdata'
        })[header] || 'text/plain';
        req.setRequestHeader('Content-Type', header + ';charset=utf-8');
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                fn && fn.call(req);
            }
        }
        if (fn) {
            req.send(data);
        } else {
            req.send();
        }
    }
    
        nest.get = function(f, d, fn, h) {
            return r("get", f, d, fn, h);
        }
        nest.post = function(f, d, fn, h) {
            return r("post", f, d, fn, h);   
        }
        nest.json = function() {
            function jsonHeader(m) {
                return function(f, fn) {
                    return m.call(null, f, fn, 'json'); 
                };
            }
            return {
                get: jsonHeader(nest.get),
                post: jsonHeader(nest.post)
            }
        }*/
    
})(document)