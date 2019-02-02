
function change(page){
  history.pushState( { 
    url: "/"+page, 
    name: page 
  }, null, "/"+page);

  showPage(page);
}
function showPage(page) {  
  if(page=="") page='homePage';
  var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200){
          document.getElementById("container").innerHTML = ajax.responseText;
          if(page==='homePage')  writeName();
          if(page==='publicList')  getPublicLists(false);
          if(page==="userList") getPrivateLists(false);
        }
        if (ajax.readyState == 4 && ajax.status == 404){
            document.getElementById("container").innerHTML = "Greska: nepoznat URLL";}
    }
    
    ajax.open("GET",page +'.html',true);
    ajax.send();
}


window.onpopstate = function (event) {  
  var content = "";
  if(event.state) {
    content = event.state.name;
  }
  if(content.substr(0,11)==='publicLists') showList(content);
  else showPage(content);
}