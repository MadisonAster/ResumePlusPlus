var HtmlHandler = pc.createScript('htmlHandler');

// initialize code called once per entity
HtmlHandler.prototype.initialize = function() {
    animationLoop();
    
    
    function resizeBackground() {
        //bg.height(window.outerHeight);
        //bg.height(screen.availHeight);
        //bg.width(screen.width);
        
        //var bg = $("#application-canvas");
        //bg.height(475);
        //bg.width(475);
        
        alert('heyo!');
        var bg = document.getElementById('application-canvas');
        bg.setAttribute("style","width:500px;height:500px");
        
    }
    $(window).resize(resizeBackground);
    resizeBackground();
    
};

// update code called every frame
HtmlHandler.prototype.update = function(dt) {
    
};

var runOnScroll = function(evt) {     
    var cam = pc.app.root.findByName('camera');
    var ypos = Math.min(getYPosition(), 1540);
    
    var camypos = ypos/-1400+0.454;
    cam.setPosition(cam.getPosition().x, camypos, cam.getPosition().z); 
    
    var farval = 2*(Math.min(ypos, 385))/-3.85+200+1;
    cam.script.dof.onAttributeChanged('far', farval); //why?
    cam.script.dof.far = farval;
};
function animationLoop(){
    requestAnimFrame(animationLoop);
    runOnScroll();
};
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame ||  
    window.msRequestAnimationFrame || 
    function(callback){
		window.setTimeout(callback, 1000.0/window.frameRate);
    };
})();

function getYPosition(){
	return (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);
};

