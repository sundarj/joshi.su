"use strict";

var Tome = Tome || {};
var output = nest.qs('output');
var agent = nest.qs('.agent');

function chicken_little() {
    localStorage.clear();
    Tome = {};
}

output.delegate('click', 'article', function() {
    var inner = this.querySelector('.page-inner');
    var s = window.getSelection();
    var r = document.createRange();
    output.classList.add('has-open');
    this.classList.add('selected');
    if (inner) {
        r.selectNodeContents(inner);
        r.collapse(false);
        s.removeAllRanges();
        s.addRange(r);
    }
});

function create(c) {
    c = c || {
        id: btoa("jsu.note"+performance.now()).replace(/=/g, ''),
        title: '',
        content: ''
    };
    var page = document.createElement('article');
    var i = document.createElement('input');
    i.placeholder = 'title';
    i.value = c.title;
    page.appendChild(i);
    
    page.id = c.id;
    Tome[page.id] = {};
    page.className = 'page';
    
    var inner = document.createElement('textarea');
    inner.className = 'page-inner';
    inner.value = c.content;
    inner.listen('dblclick', function(e) {
        e.preventDefault();
        this.parentNode.classList.remove('selected');
        nest.qs('.selected').length < 2 && output.classList.toggle('has-open');
    });
    
    page.appendChild(inner);
    page.appendChild(agent);
    output.appendChild(page);
    
    setTimeout(function() {
        page.style.opacity = 1;
    }, 200);
}

function save_content() {
    var ps = nest.qs('.page');
    chicken_little();
    if (ps) {
        if (ps.forEach) {
            ps.forEach(function(page) {
                Tome[page.id] = {};
                Tome[page.id].title = page.qs('input').value;
                Tome[page.id].content = page.qs('.page-inner').value;
            });
        } else {
            Tome[ps.id] = {};
            Tome[ps.id].title = ps.qs('input').value;
            Tome[ps.id].content = ps.qs('.page-inner').value;
        }
    }
    localStorage['jsu.note'] = JSON.stringify(Tome);
}

agent.listen('click', function(e) {
    e.stopPropagation();
    window[this.dataset.action]();
});

var istyping;
window.listen('keyup', function() {
    clearTimeout(istyping);
    istyping = setTimeout(save_content, 1500);
});

window.listen('load', function() {
    if (localStorage['jsu.note']) {
        Tome = JSON.parse(localStorage['jsu.note']);
        for (var page in Tome) {
            create({
                id: page,
                title: Tome[page].title,
                content: Tome[page].content
            });
        }
    }
});

window.listen('beforeunload', function() {
    save_content();
    localStorage['jsu.note'] = JSON.stringify(Tome);
    return null;
});

window.listen("keydown", function(e) {
   if (e.ctrlKey) {
       var which = String.fromCharCode(e.which);
       if ( which === 'S') {
           e.preventDefault();
           Tome = localStorage["jsu.note"];
           saveAs(new Blob([JSON.stringify(Tome)], {type: "text/plain,charset=utf-8"}), "notes.json");
       } else if (which === 'O') {
            e.preventDefault();
            nest.qs('.file-open', function(change) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    chicken_little();
                    Tome = JSON.parse(e.target.result);
                    localStorage["jsu.note"] = Tome;
                    window.removeEventListener('onbeforeunload');
                    window.location.reload(true);
                }
                var opened = reader.readAsText(this.files[0]);
            });
            nest.qs('.file-open').click();
       }
   }
});