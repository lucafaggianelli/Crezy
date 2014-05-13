Crezy = {};
window.onload = function() {
    Crezy.impress = impress();
    Crezy.init();
};

Crezy.init = function() {
    //document.addEventListener('impress:init', Crezy._onInit);
    document.addEventListener('impress:stepenter', Crezy._onStepEnter);
    //document.addEventListener('impress:stepleave', Crezy._onStepLeave);
};

Crezy._onStepEnter = function(event) {
    console.log('Entered step', event.target.id);

    switch(event.target.id) {
    case 'dl-places':
        var map = new AmCharts.AmMap();
        map.pathToImages = "ammap/images/";

        var dataProvider = {
            map: "worldLow",
            areas:[
                {id:"IT", color:"#CC0000"},
                {id:"US", color:"#00CC00"},
                {id:"VN", color:"#0000CC"},
                {id:"SK", color:"#0000CC"},
                {id:"CN", color:"#0000CC"}]
        };
        map.dataProvider = dataProvider;

        /* create areas settings
         * autoZoom set to true means that the map will zoom-in when clicked on the area
         * selectedColor indicates color of the clicked area.
         */
        map.areasSettings = {
            //autoZoom: true,
            //selectedColor: "#CC0000"
        };

        // let's say we want a small map to be displayed, so let's create it
        //map.smallMap = new AmCharts.SmallMap();

        // write the map to container div
        map.write("mapdiv");
        break;
    case 'where':
        break;
        var globe = event.target.getElementsByClassName('globe')[0];
        globe.style.backgroundPosition = '0px 0px';
        
        setInterval(function(){
            var pos = parseInt(globe.style.backgroundPosition.split(' ')[0].slice(0,-2));
            pos += 10;
            if (pos > 640) pos -= 640;
            globe.style.backgroundPosition = pos+'px 0px';
        }, 50);
        break;
    };
    
    if (!this.animations) return;
    this.animations[event.target.id];
};
