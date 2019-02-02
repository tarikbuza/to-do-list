var platform;
var myLat,myLng;
var lat,lng;
var pixelRatio;
var defaultLayers;
var map,map2,behavior,ui;
var bubble;

navigator.geolocation.getCurrentPosition(showPositionItem);
function openMap(e){
    e.preventDefault();
    lat = undefined;
    lng = undefined;
    if(document.getElementById('addItemMap').innerHTML!==""){
        document.getElementById('addItemMap').innerHTML="";
        
    }
    else {
        platform = new H.service.Platform({
        app_id: 'DCO4LUDHYRS1foINnFP0',
        app_code: '7fXbM6yMi_y2VwRdT6qu-g',
        useHTTPS: true
    });
    pixelRatio = window.devicePixelRatio || 1;
    defaultLayers = platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ? undefined : 320
    });
    
    map= new H.Map(document.getElementById('addItemMap'),defaultLayers.normal.map);
    behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    
    // Create the default UI components
    ui = H.ui.UI.createDefault(map, defaultLayers);
    navigator.geolocation.getCurrentPosition(showPosition);
    map.addEventListener('tap', function (evt) {        
        removeLocationsFromMap();
        var group = new H.map.Group();
        var coord = map.screenToGeo(evt.currentPointer.viewportX,
                evt.currentPointer.viewportY);
        position = {
            lat: coord.lat.toFixed(4),
            lng: coord.lng.toFixed(4)
        };      
        lat = position.lat;
        lng = position.lng;  
        marker = new H.map.Marker(position);
        marker.label = Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S') + ' ' + Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W');
        group.addObject(marker);
        group.addEventListener('tap', function (evt) {
            map.setCenter(evt.target.getPosition());
            openBubble(
               evt.target.getPosition(), evt.target.label);
          }, false);
        map.addObject(group);
    });
    }
} 

function showPosition(position){   
    myLat = position.coords.latitude;
    myLng = position.coords.longitude;
    map.setZoom(15);
    map.setCenter({ lng:  position.coords.longitude, lat:    position.coords.latitude });
}
function showPositionItem(position){   
    myLat = position.coords.latitude;
    myLng = position.coords.longitude;
}

function removeLocationsFromMap(){
    lat=undefined;
    lng=undefined;
    var objects = map.getObjects();
    map.removeObjects(objects);
}
function openBubble(position, text){
    if(!bubble){
       bubble =  new H.ui.InfoBubble(
         position,
         {content: text});
       ui.addBubble(bubble);
     } else {
       bubble.setPosition(position);
       bubble.setContent(text);
       bubble.open();
     }
}

function getCoordinates(){
    return {
        lat:lat,
        lng:lng
    };
}
function showGeo(latitude,longitude,content){
    if(document.getElementById('showGeolocation').innerHTML!=="")
        document.getElementById('showGeolocation').innerHTML="";
    else{
    platform = new H.service.Platform({
        app_id: 'DCO4LUDHYRS1foINnFP0',
        app_code: '7fXbM6yMi_y2VwRdT6qu-g',
        useHTTPS: true
    });
    pixelRatio = window.devicePixelRatio || 1;
    defaultLayers = platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ? undefined : 320
    });
    
    map2= new H.Map(document.getElementById('showGeolocation'),defaultLayers.normal.map);
    behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map2));
    // Create the default UI components
    ui = H.ui.UI.createDefault(map2, defaultLayers);
    var group = new H.map.Group();
    position = {
        lat: latitude,
        lng: longitude
    };      
    marker = new H.map.Marker(position);
    marker.label = content;
    group.addObject(marker);
    /*var myPosition = {
        lat: myLat,
        lng: myLng
    };  
    myMarker = new H.map.Marker(myPosition);
    myMarker.label = "Your position";
    group.addObject(myMarker);*/
    group.addEventListener('tap', function (evt) {
        map2.setCenter(evt.target.getPosition());
        openBubble(
            evt.target.getPosition(), evt.target.label);
        }, false);
    map2.addObject(group);
    map2.setZoom(15);
    map2.setCenter({ lng:  longitude, lat:    latitude });

}
}

function setCoordinates(){
    lat = undefined;
    lng = undefined;
}