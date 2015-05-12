"use strict";

localforage.config({
    name: 'jsu',
    storeName: 'note'
});

var Tome = nest.obj();
localforage.iterate(function(content, key) {
    var obj = nest.obj();
    obj.title = content.title;
    obj.content = content.content;
    Tome[key] = obj;
    noveau.index(key);
    localforage.length().then(dom.id);
}).then(nest.console('initialized').info);

var dom = {
    noteTitle: nest.qs('.note-title'),
    notePage: nest.qs('.note-page'),
    noteContents: nest.qs('.notepad-contents'),
    noteCreator: nest.qs('.creator'),
    output: nest.qs('output'),
    frag: document.createDocumentFragment(),
    id: (function(initial) {
        var n = initial || 0;
        return function() {
            return 'note-'+(++n);   
        };
    })()
}

function chicken_little() {
    localforage.clear();
    Tome = nest.obj();
}

HTMLElement.prototype.corresponding = function() {
    var self = this;
    return {
        flipto: function() {
            cur = self.dataset.to;
            dom.noteTitle.value = Tome[self.dataset.to].title;
            dom.notePage.value = Tome[self.dataset.to].content;
        }
    };
}

dom.noteContents.delegate('click', 'li', function() {
    this.corresponding().flipto();
});

var cur;

var noveau = {
    index: function(id) {
        dom.output.classList.remove("hidden");
        var existing = document.querySelectorAll('[data-to="'+id+'"]');
        if (!existing.length) {
            var li = document.createElement('li');
            li.dataset.to = id;
            li.textContent = Tome[id].title;
            dom.noteContents.appendChild(li);
        } else {
            existing[0].textContent = Tome[id].title;
        }
    },
    page: function() {
        dom.output.classList.remove("hidden");
        dom.noteTitle.value = dom.notePage.value = '';
        dom.noteTitle.focus();
        cur = dom.id();
    }
};

dom.output.listen('input', 1000).then(function() {
    Tome[cur] = {
        title: dom.noteTitle.value,
        content: dom.notePage.value
    }
    noveau.index(cur);
    localforage.setItem(cur, Tome[cur]);
});

dom.noteCreator.listen('click', noveau.page);