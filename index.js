const Koa = require('koa');
const app = new Koa();
const path = require('path');
const view = require('koa-views');
const rewrite = require('koa-rewrite');

app.use(view('exports', {
    map: {
        html: 'toffee'
    }
}));

app.use( rewrite(/\/use\/([^/]+\.css)$/, '/use/sheets/$1') )
app.use( rewrite(/\/use\/([^/]+\.js)$/, '/use/scripts/$1') )
app.use( rewrite(/\/use\/([^/]+\.png)$/, '/use/images/$1') )

app.use(function* (next) {
    const template = (this.req.url.slice(1) || 'index') + '.json';
    const templatePath = path.join( __dirname, 'exports/template/' );
    
    try {
        this.state = require( templatePath + template );
        yield this.render( 'index' ); 
    } catch(e) {
        yield next;
    }  
});

app.use( require('koa-static')('exports') );

app.listen(1337);