self.onmessage= function(msg){
    function getUserContribution() {
        var ajax = new XMLHttpRequest();
        var response;
        ajax.onreadystatechange = function(){
            if(ajax.readyState == 4 && ajax.status == 200){
                response = JSON.parse(ajax.responseText);
                postMessage(response);
            }
        }
        ajax.open("GET", "/contribution/" + msg.data.listid);
        ajax.send();
    }
    getUserContribution();

}