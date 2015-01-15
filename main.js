"use strict";

function 歴史(href, replace) {
    var hrefstate = href.split("/");
        hrefstate = hrefstate[hrefstate.length-1];
    replace = replace?'replaceState':'pushState';
    history[replace]({
        url: hrefstate
    }, null, href);
    var req = new XMLHttpRequest();
    req.open("GET", href, false);
    req.send();
    var modal = nest.qs('.modal');
    modal.addClass('is');
    modal.innerHTML = req.responseText;
}

nest.qs('a:not([class])', function(click) {
    if (history.pushState) {
        click.preventDefault();
        歴史(this.href);
    }
});

window.listen('popstate', function(e) {
    if (e.state && e.state.url === '/')
        nest.qs('.modal').removeClass('is');
    else
        歴史(e.state.url, true);
});

history.replaceState({
    url: '/'
}, null, '/'+location.search);

window.listen('load', function() {
   if (location.search)
       歴史(location.search.substr(1));
});