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
    noteDestroyer: nest.qs('.×'),
    output: nest.qs('output'),
    file: nest.qs('.file-open'),
    help: nest.qs('.helpme'),
    helpBtn: nest.qs('.\\?'),
    id: function() {
        return (new Date * Math.random()).toString(36).replace(/\./g,'');
    },
    order: []
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
    index: function(id, folder) {
        dom.output.classList.remove("hidden");
        var existing = document.querySelector('[data-to="'+id+'"]');
        var title = folder ? Tome[id].title.split(":")[1] : Tome[id].title;
        if (!existing) {
            var li = document.createElement('li');
            li.dataset.to = id;
            li.className = 'note';
            li.textContent = title;
            li.draggable = true;
            if (folder) {
                folder.querySelector('ul').appendChild(li);
                dom.noteContents.appendChild(folder);
            } else {
                dom.noteContents.appendChild(li);
            }
        } else {
            if (folder) {
                var current = existing.parentElement.parentElement;
                folder.querySelector('ul').appendChild(existing);
                current.className === 'note-folder' && current.remove();
                dom.noteContents.appendChild(folder);
            }
            existing.textContent = title;
        }
    },
    page: function() {
        dom.output.classList.remove("hidden");
        dom.noteTitle.value = dom.notePage.value = '';
        dom.noteTitle.focus();
        cur = dom.id();
    },
    folder: function(id) {
        var title = Tome[id].title.split(":");
        var folder = document.querySelector('[data-folder="'+title[0]+'"]');
        
        if (!folder) {
            folder = document.createElement('li');
            folder.className = 'note-folder';
            folder.dataset.folder = folder.innerHTML = title[0];
            folder.appendChild(document.createElement('ul'));
        }
        
        noveau.index(id, folder);
        
    }
};

dom.output.listen('input', 1000).then(function(e) {
    Tome[cur] = {
        title: dom.noteTitle.value,
        content: dom.notePage.value
    }
    if (dom.noteTitle.value.split(":").length === 1)
        noveau.index(cur);
    else
        noveau.folder(cur);
    
    localforage.setItem(cur, Tome[cur]);
});

    dom.noteTitle.listen('keyup', function(e) {
       if (e.which === 13)
           dom.notePage.focus();
    });

dom.noteCreator.listen('click', noveau.page);

localforage.iterate(function(content, key) {
    if (key==='order') return;
    Tome[key] = {
        title: content.title,
        content: content.content
    };
}).then(function() {
    console.info('initialised');
    
    localforage.getItem("order").then(function(order) {
        order = order || [];
        if (!order.length && Object.keys(Tome).length)
            order = Object.keys(Tome);
        order.forEach(function(id) {
            var folder = Tome[id].title.split(":");
            if (folder[1])
                noveau.folder(id);
            else
                noveau.index(id); 
        });
        
        var latest = document.querySelector('[data-to="'+localStorage["jsu.note.latest"]+'"]');
        latest && latest.click();
    });
});

dom.noteContents.listen('dragover', function(e) { e.preventDefault() });
dom.noteContents.delegate('dragstart', 'li', function(e) {
   e.dataTransfer.setData("text", e.target.dataset.to);
});

function swapElements(a, b) {
    var temp = document.createElement("div");
    a.parentNode.insertBefore(temp, a);
    b.parentNode.insertBefore(a, b);
    temp.parentNode.insertBefore(b, temp);
    temp.parentNode.removeChild(temp);
}

dom.noteContents.listen('drop', function(e) {
    swapElements(e.target, document.querySelector('[data-to="'+e.dataTransfer.getData("text")+'"]'));
});


window.listen('beforeunload', function() {
    nest.each(Tome, function(id) {
           if (Tome[id].title === dom.noteTitle.value)
               localStorage["jsu.note.latest"] = id;
    });
    var notes = nest.qs('.note');
    notes = notes.forEach ? notes : [notes];
    notes.forEach(function(note) {
        dom.order.push(note.dataset.to);
    });
    localforage.setItem("order", dom.order);
})

dom.file.listen('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(e) {
        Tome = JSON.parse(e.target.result);
        nest.each(Tome, function(id) {
            localforage.setItem(id, Tome[id], function() {
                localforage.length().then(function(length) {
                     if (length === Object.keys(Tome).length+1)
                         location.reload();
                });
            }); 
        });
    }
    reader.readAsText(this.files[0]);
});

nest.keys({
    ctrl: {
       s: function() { saveAs(new Blob([JSON.stringify(Tome)], {type: 'application/json,charset=utf-8'}), 'notes.json') },
       o: function() { dom.file.click() },
       m: function() { dom.noteCreator.click() },
       '.': function() { dom.noteDestroyer.click() }
    },
    shift: {
        '¿': function() {
            dom.helpBtn.click(); 
        }
    }
});

dom.helpBtn.listen('click', function() { dom.help.classList.toggle('shown') });

dom.noteDestroyer.listen('click', function() {
    localforage.removeItem(cur);
    document.querySelector('[data-to="'+cur+'"]').remove();
    var parentfolder = document.querySelector("[data-folder='fn']".replace('fn', dom.noteTitle.value.split(":")[0]));
    if (parentfolder && (!parentfolder.qs('ul').children.length))
        parentfolder.remove();
    dom.noteTitle.value = dom.notePage.value = '';
    delete dom.order[dom.order.indexOf(cur)];
    localforage.removeItem("order");
});