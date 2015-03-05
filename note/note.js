var Tome = {};
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
    
    inner = document.createElement('div');
    inner.className = 'page-inner';
    inner.contentEditable = true;
    inner.innerHTML = c.content;
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
    if (ps) {
        if (ps.forEach) {
            ps.forEach(function(page) {
                Tome[page.id].title = page.qs('input').value;
                Tome[page.id].content = page.qs('.page-inner').innerHTML.replace(/<div>/g, '\n').replace(/<\/div>|<br>/g, '');
            });
        } else {
            Tome[ps.id].title = ps.qs('input').value;
            Tome[ps.id].content = ps.qs('.page-inner').innerHTML.replace(/<div>/g, '\n').replace(/<\/div>|<br>/g, '');
        }
    }
    
    
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
});