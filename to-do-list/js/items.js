function deleteItem(id, listId,newBool){
    var itemId = id;
    document.getElementById('showGeolocation').innerHTML="";
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4 && ajax.status == 200){
            getListItems(listId,globalListName,newBool);
        }
    };
    ajax.open('DELETE', '/deleteitem/' + itemId);
    ajax.send();
  }

function check(itemId, listId, listName,newBool){
    
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4 && ajax.status == 200){
            getListItems(listId,listName,newBool);
        }
    }
    ajax.open("PUT","/check/"+itemId);
    ajax.send();
  }



function star(element, itemId,listId,listName,newBool){
      var svg=element.getElementsByTagName('polygon')[0];
      var style;
        if (window.getComputedStyle) {
            style = window.getComputedStyle(svg);
        } else {
            style = svg.currentStyle;
        }  
      if(style.fill==='rgb(255, 255, 255)')
        svg.setAttribute("style","stroke:#3f3f3f ; fill:#f8e51b");
      else  
        
      svg.setAttribute("style","stroke:grey ; fill:white");
      var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4 && ajax.status == 200){
            getListItems(listId,listName,newBool);
        }
    }
    ajax.open("PUT","/important/"+itemId);
    ajax.send();
      
  }

  function addItem(e,newBool){
    e.preventDefault();    
    document.getElementById('addItemMap').innerHTML="";
    var listId = globalListId;
    var listName = globalListName;
    var userId = JSON.parse(localStorage.getItem('toDo')).id;
    var content = document.getElementById('item').value;
    var position = getCoordinates();
    var lat = position.lat, lng = position.lng;
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4 && ajax.status == 200){   
            modalItem.style.display = "none";
            getListItems(listId,listName,newBool);
        }
    };
    ajax.open('POST', '/' + listId + '/additem');
    ajax.setRequestHeader("Content-type",'application/json')
    ajax.send(JSON.stringify({
        item:{
            content : content,
            lat: lat,
            lng: lng,
            hasGeo: (lat === undefined || lng === undefined)? false:true,
            userId : userId
        },
        listId : listId
    }));
  }