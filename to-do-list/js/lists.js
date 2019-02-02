function changeList(page){
    history.pushState( { 
      url: "/"+page, 
      name: page 
    }, null, "/"+page);
  
    showList(page);
  }
  


function showList(page) {  
    document.getElementById("listName").innerHTML = "List Name" +page;
}

var globalListId,globalListName,webWorker;

function getPublicLists(isCalled){
  var ajax = new XMLHttpRequest();
  var userId = JSON.parse(localStorage.getItem('toDo')).id;
  ajax.onreadystatechange = function(){
      if(ajax.readyState == 4 && ajax.status == 200){
          var response = JSON.parse(ajax.responseText); 
          var list = document.getElementById('publicLists');
          list.innerHTML="";
          document.getElementById("listName").innerHTML = "";
          if(!(response.data === null || response.data.length===0 || Object.entries(response.data).length===0)){
            response.data.forEach(function(element){
                var newDiv   = document.createElement('div');
                var newDivInner   = document.createElement('div');
                var newName   = document.createElement('span');
                var newButton  = document.createElement('button');
                var newTrash  = document.createElement('img');
                newDiv.className="Lists__singleList";
                newDivInner.className="Lists__singleListInner"
                newName.className="Lists__ListName";
                newButton.className="Lists__button";
                newButton.innerHTML="See List";
                newTrash.className="Lists__delete";
                newTrash.src="../images/trashCan.png";
                newName.innerHTML=element.listName;
                newButton.onclick = function(){getListItems(element.listId,element.listName,true)}
                newTrash.onclick = function(){deleteList(element.listId,false)}
                newDiv.appendChild(newName);
                newDivInner.appendChild(newButton);
                newDivInner.appendChild(newTrash);
                newDiv.appendChild(newDivInner);
                list.appendChild(newDiv);
            });
            if(isCalled) getListItems(response.data[response.data.length-1].listId,response.data[response.data.length-1].listName,true);
            else  getListItems(response.data[0].listId,response.data[0].listName,true);
        }
        else{
            document.getElementById("fullPie").style.display="none";
            document.getElementById('showGeolocation').innerHTML = "";
            var listTable = document.getElementById("listTable");
            listTable.removeChild(listTable.lastChild);
            document.getElementById("itemTable").getElementsByTagName('tbody')[0].innerHTML=`<tr>
                                                                                        <th>Checked</th>
                                                                                        <th>Content</th>
                                                                                        <th>Location</th>
                                                                                        <th>Star</th>
                                                                                        <th>Delete</th>
                                                                                    </tr>`;
        }
          
      }
  }
  ajax.open('GET','/' + userId + '/lists');
  ajax.send();
}



function getListItems(id,listName,public){
  var ajax = new XMLHttpRequest();
  var listId = id;
  globalListId = id;
  globalListName=listName;
  var userId = JSON.parse(localStorage.getItem('toDo')).id;
  ajax.onreadystatechange = function(){
      if(ajax.readyState == 4 && ajax.status == 200){
          var styleCheck, styleStar,showGeoIcon;
          var response = JSON.parse(ajax.responseText); 
          document.getElementById("listName").innerHTML=listName;
          var table;
          if(public)table = document.getElementById('itemTable').getElementsByTagName('tbody')[0];
          else table = document.getElementById('itemTablePrivate').getElementsByTagName('tbody')[0];
          table.innerHTML = `<tr>
                                <th>Checked</th>
                                <th>Content</th>
                                <th>Location</th>
                                <th>Star</th>
                                <th>Delete</th>
                            </tr>`;
          response.data.forEach(function(element){
              if(element.Done==1){
                styleCheck="background:green; border:solid green;";
              }
              else{
                styleCheck="background:white; border:solid grey;";
              }
              if(element.Important==1){
                styleStar="stroke:#3f3f3f ; fill:#f8e51b;stroke-width:1.5";
              }
              else{
                styleStar="stroke:grey ; fill:white;stroke-width:1.5";
              }
              if(element.hasGeo==1){
                showGeoIcon=`<div  onclick="showGeo(`+element.Latitude+','+element.Longitude+",'"+element.itemContent+`')" id="check" >
                <img  src="../images/geolocation.png" class="Lists__delete"/>
            </div>`
              }
              else{
                showGeoIcon=`<div id="check" >
                <img  src="../images/redcross.png" class="Lists__delete"/>
            </div>`
              }
          var rowHtml =     ` <td>
                    <div style="`+styleCheck+`" onclick="check(`+element.itemId+','+listId+",'"+listName+"',"+public+`)" id="check" class="Lists__doneItem">
                        <img  src="../images/check-icon.png"/>
                    </div>
                </td>
                <td>` + element.itemContent + `</td>
                <td>
                    `+showGeoIcon+`
                </td>
                <td class="Lists__star" onclick="star(this,`+element.itemId+','+listId+",'"+listName+"',"+public+`)">
                        <svg class="svg" width="36" height="36" xmlns="http://www.w3.org/2000/svg" >
                            <polygon style="`+styleStar+`" id="star" points="14,0,18.11449676604731,8.336881039375367,27.31479122813215,9.673762078750736,20.657395614066075,16.16311896062463,22.228993532094627,25.326237921249263,14,21,5.771006467905378,25.326237921249266,7.342604385933925,16.163118960624633,0.685208771867849,9.67376207875074,9.885503233952686,8.336881039375369"></polygon>
                        </svg>
                </td>
                
                <td>   
                    <img src="../images/trashCan.png" class="Lists__delete" onclick="deleteItem(` + element.itemId +','+listId  +','+public+`)"/>
                </td>
              `

              var newRow   = table.insertRow(table.rows.length);
              newRow.innerHTML = rowHtml;                
          });
          
          if(public){
            if(document.getElementById("listName").innerHTML!=="" && document.getElementById("addButton")===null){
                var divButtons = document.createElement('div');
            
                divButtons.className = "Lists__table__add";
                var divHtml= `<button id="addPerson"class="Lists__buttonAdd" onclick="addPersonModal()">Add person</button>
                <button id="addButton"class="Lists__buttonAdd" onclick="addItemModal()">Add item</button>`;
                divButtons.innerHTML = divHtml;
                document.getElementById("listTable").appendChild(divButtons);
                
            }
            drawContribution(response.data.length===0);
            
          } 
          else{
            if(document.getElementById("listName").innerHTML!=="" && document.getElementById("addButtonPrivate")===null){
                var divButtons = document.createElement('div');
            
                divButtons.className = "Lists__table__add";
                var divHtml= `<button id="addButtonPrivate"class="Lists__buttonAdd" onclick="addItemModal()">Add item</button>`;
                divButtons.innerHTML = divHtml;
                document.getElementById("listTablePrivate").appendChild(divButtons);
            }
            
          }
          
      }
  }
  ajax.open('GET', '/' + userId + '/lists/' + listId);
  ajax.send();
}

function drawContribution(newBool){
    if(typeof(webWorker) != "undefined"){
        webWorker.terminate();}
    if (typeof(Worker) !== "undefined") {
        
            webWorker = new Worker("js/webWorker.js");
            webWorker.postMessage({listid:globalListId});
          }
          webWorker.onmessage = function(event) {
              
            drawPieChart(event.data,newBool);
          };
    
}


function addList(e, private){
    e.preventDefault();
    var userId = JSON.parse(localStorage.getItem('toDo')).id;
    listName=document.getElementById('addListName').value;
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4 && ajax.status == 200){
            modalList.style.display = "none";
            if(private) getPrivateLists(true);
            else getPublicLists(true);
        }
    };
    ajax.open('POST', '/addList');
    ajax.setRequestHeader('Content-type', 'application/json');
    ajax.send(JSON.stringify({
        userId : userId,
        listName : listName,
        private : private
    }));
}
function deleteList(listId, private){
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4 && ajax.status == 200){
            if(private) getPrivateLists(false)
            else getPublicLists(false);
        }
    };
    ajax.open('DELETE', '/deleteList/' + listId);
    ajax.send();
}

function addPersonToList(e){
    e.preventDefault();
    var email = document.getElementById("personEmail").value;
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4 && ajax.status==200){
            modalPerson.style.display = "none";
            getListItems(globalListId,globalListName,true);
        }
    }
    ajax.open('POST','/addUser');
    ajax.setRequestHeader('Content-type', 'application/json');
    ajax.send(JSON.stringify({
        email : email,
        listId : globalListId
    }));
}

function getPrivateLists(isCalled){
    var ajax = new XMLHttpRequest();
    var userId = JSON.parse(localStorage.getItem('toDo')).id;
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4 && ajax.status == 200){
            var response = JSON.parse(ajax.responseText); 
            var list = document.getElementById('userLists');           
            list.innerHTML="";
            document.getElementById("listName").innerHTML = "";
            if(!(response.data === null || response.data.length===0 || Object.entries(response.data).length===0)){
                response.data.forEach(function(element){
                    var newDiv   = document.createElement('div');
                    var newDivInner   = document.createElement('div');
                    var newName   = document.createElement('span');
                    var newButton  = document.createElement('button');
                    var newTrash  = document.createElement('img');
                    newDiv.className="Lists__singleList";
                    newDivInner.className="Lists__singleListInner"
                    newName.className="Lists__ListName";
                    newButton.className="Lists__button";
                    newButton.innerHTML="See List";
                    newTrash.className="Lists__delete";
                    newTrash.src="../images/trashCan.png";
                    newName.innerHTML=element.listName;
                    newButton.onclick = function(){getListItems(element.listId,element.listName,false)}
                    newTrash.onclick = function(){deleteList(element.listId,true)}
                    newDiv.appendChild(newName);
                    newDivInner.appendChild(newButton);
                    newDivInner.appendChild(newTrash);
                    newDiv.appendChild(newDivInner);
                    list.appendChild(newDiv);
                });
                if(isCalled) getListItems(response.data[response.data.length-1].listId,response.data[response.data.length-1].listName,false);
                else  getListItems(response.data[0].listId,response.data[0].listName,false);
            }
            else {
                var listTable = document.getElementById("listTablePrivate");
                document.getElementById('showGeolocation').innerHTML = "";
                listTable.removeChild(listTable.lastChild);
                document.getElementById("itemTablePrivate").getElementsByTagName('tbody')[0].innerHTML=`<tr>
                                                                                            <th>Checked</th>
                                                                                            <th>Content</th>
                                                                                            <th>Location</th>
                                                                                            <th>Star</th>
                                                                                            <th>Delete</th>
                                                                                        </tr>`;
            }
            
        }
    }
    ajax.open('GET','/' + userId + '/privateLists');
    ajax.send();
  }