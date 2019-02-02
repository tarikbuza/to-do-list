var modalItem, modalList,modalPerson;


function addItemModal(){
  document.getElementById("item").value="";
 modalItem = document.getElementById('modalItem');
 btn = document.getElementById("addButton");
 modalItem.style.display = "block";
 setCoordinates();
}


function closeModalItem() {
 document.getElementById('addItemMap').innerHTML="";
 modalItem.style.display = "none";
}


function addPersonModal(){
  document.getElementById("personEmail").value="";
modalPerson = document.getElementById('modalPerson');
 btn = document.getElementById("addPerson");
 modalPerson.style.display = "block";
}


function closePersonModal() {
    modalPerson.style.display = "none";
}

function addListModal(){
  document.getElementById("addListName").value="";
 modalList = document.getElementById('modalList');
 btn = document.getElementById("addList");
 modalList.style.display = "block";
}


function closeListModal() {
    modalList.style.display = "none";
}



window.onclick = function(event) {
  if (event.target == modalPerson) {
    modalPerson.style.display = "none";
  }
  if (event.target == modalItem) {
    document.getElementById('addItemMap').innerHTML="";
    modalItem.style.display = "none";
  }
  if (event.target == modalList) {
    modalList.style.display = "none";
  }
}