function logOut(){
    localStorage.removeItem('toDo');
    history.replaceState( null, null, "/");
    changeContent('login');
}
function writeName(){
    document.getElementById('homePageName').innerHTML="Welcome "+JSON.parse(localStorage.getItem('toDo')).userName;
}

function changePassword(e){
    e.preventDefault();
    var currentPassword = document.getElementById("currentPassword").value;
    var newPassword = document.getElementById("newPassword").value; 
    var confirmPassword = document.getElementById("confirmPassword").value;
    if(newPassword != confirmPassword){
        var errorMessage = "Passwords don't match";
        //log error
        return;
    } 
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4 && ajax.status == 200){
            change('homePage');
            var message = JSON.parse(ajax.responseText).message;
            //log message
        }
    }
    ajax.open("POST", "/changePassword");
    ajax.setRequestHeader("Content-Type", "application/JSON");
    ajax.send(JSON.stringify({
        userId : JSON.parse(localStorage.getItem("toDo")).id,
        oldPassword : currentPassword,
        newPassword : newPassword
    }));  
}