if(localStorage.getItem('toDo')) changeContentUser('homePage');
else changeContent('login');
function changeContent(page){
    if(page=='login'){
        document.getElementById("menuIndex").innerHTML =null}
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200){
            if (page=='menu'){
                document.getElementById("menuIndex").innerHTML = ajax.responseText;
            }
            else {
                document.getElementById("container").innerHTML = ajax.responseText;
                if(page==='homePage')  writeName();
            }
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            document.getElementById("container").innerHTML = "Greska: nepoznat URL";
    }
    ajax.open("GET",page +'.html',true);
    ajax.send();
}

function changeContentUser(page){
    changeContent('menu');
    changeContent(page);
}

function redirectLogin(){
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200){
            var response=JSON.parse(ajax.responseText);
            if(JSON.parse(ajax.responseText).data===null) document.getElementById("errorMsg").innerHTML=response.message;
            else{ 
                var storage={
                    id:response.data.id,
                    userName:response.data.name
                }
                localStorage.setItem('toDo',JSON.stringify(storage));
                changeContentUser('homePage');
                history.replaceState( { 
                url: "/homePage", 
                name: "homePage" 
              }, null, "/homePage");
            }
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            document.getElementById("container").innerHTML = "Greska: nepoznat URL";
    }
    ajax.open("POST", '/login',true);
    ajax.setRequestHeader("Content-Type", "application/JSON");
    ajax.send(JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    }));  
}

function redirectRegister(){
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200){
            var response=JSON.parse(ajax.responseText);
            if(JSON.parse(ajax.responseText).data===null) document.getElementById("errorMsg").innerHTML=response.message;
            else{ 
                var storage={
                    id:response.data.userId,
                    userName:response.data.name
                }
                localStorage.setItem('toDo',JSON.stringify(storage));
                changeContentUser('homePage');
                history.replaceState( { 
                url: "/homePage", 
                name: "homePage" 
              }, null, "/homePage");
            }
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            document.getElementById("container").innerHTML = "Greska: nepoznat URL";
    }
    ajax.open("POST", '/register',true);
    ajax.setRequestHeader("Content-Type", "application/JSON");
    ajax.send(JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        lastName: document.getElementById("lastName").value,
        firstName: document.getElementById("firstName").value
    }));  
}