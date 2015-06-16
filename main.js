"use strict";

function vista() {
    this.view = nest.qs('.view');
};

vista.prototype.state = function() {
    
    function Act(action, intel) {
        history[action+"State"](intel, intel.title, intel.url);
        this.view.src = intel.src || intel.url;
    };
    
    return {
        
        push: Act.bind(this, "push"),
        replace: Act.bind(this, "replace")
        
    }
    
};

const Vista = new vista;

Vista.state().replace({
    
    url: '/',
    title: 'jsu',
    src: '/ghost.html'
    
});

Vista.view.listen('load', function() {
    
    nest.qs(this.contentDocument, 'a:not(.ignore-me)', function(click) {
        
        click.preventDefault();
        
        return Vista.state().push({
            
            url: this.href,
            title: this.textContent.replace(/\n/g, '')
            
        });
        
    });
    
});