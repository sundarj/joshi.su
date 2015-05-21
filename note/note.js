"use strict";

localforage.config({
    name: 'jsu',
    storeName: 'note'
});

var Tome = {};

var dom = {
    noteTitle: nest.qs('.note-title'),
    notePage: nest.qs('.note-page'),
    noteContents: nest.qs('.notepad-contents'),
    noteCreator: nest.qs('.creator'),
    output: nest.qs('output'),
    file: nest.qs('.file-open'),
    id: function() {
        return (new Date * Math.random()).toString(36).replace(/\./g,'');
    }
};

function chicken_little() {
    localforage.clear();
    Tome = {};
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
};

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
            var close = document.createElement('button');
            close.textContent = close.className = '×';
            li.appendChild(close);
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

localforage.iterate(function(content, key) {
    Tome[key] = {
        title: content.title,
        content: content.content
    };
    noveau.index(key);
    localforage.length().then(dom.id);
}).then(function() {
    console.info('initialised');
    
    var latest = document.querySelector('[data-to="'+localStorage["jsu.note.latest"]+'"]');
    latest && latest.click();
    
    nest.qs('.×', function(click) {
        localforage.removeItem(this.parentNode.dataset.to);
        this.parentNode.remove();
    });
});

window.onbeforeunload = function() {
    nest.each(Tome, function(id) {
           if (Tome[id].title === dom.noteTitle.value)
               localStorage["jsu.note.latest"] = id;
    })
}

dom.file.listen('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(e) {
        Tome = JSON.parse(e.target.result);
        nest.each(Tome, function(id) {
            localforage.setItem(id, Tome[id], function() {
                localforage.length().then(function(length) {
                     if (length === Object.keys(Tome).length)
                         location.reload();
                });
            }); 
        });
    }
    reader.readAsText(this.files[0]);
});

nest.keys({
   ctrl: {
       s: function() {
            saveAs(new Blob([JSON.stringify(Tome)], {type: 'application/json,charset=utf-8'}), 'notes.json');
       },
       o: function() {
           dom.file.click();
       }
   }
});