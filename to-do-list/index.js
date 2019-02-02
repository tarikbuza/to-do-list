const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cookie=require('cookie-parser');
var bcrypt = require('bcrypt-nodejs');
const app = express();
const model = require('./model.js');

//app.use(express.static('./'));
app.use(bodyParser.json());
app.use(cookie());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/css", express.static('public/css'));
app.use("/js", express.static('./js'));
app.use("/images", express.static('public/images'));
app.use("/", express.static('public/view'));
app.get('/',function(req,res){
    /*if(req.cookies.username == "tarik"){
        res.sendFile(__dirname + '/public/view/homePage.html');  
    }*/
    res.sendFile(__dirname + '/index.html');  
});


app.post('/login', function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    model.checkLoginCredentials(email, password, function(result, id,name){
        if(result){
            res.send({
                message: "Login successful",
                data: {
                    name: name,
                    id: id
                }
            });

        }   
        else{
            res.send({
                message: "Invalid login data!",
                data: null
            });
        } 
        res.end();
    });
});

app.get('/:userId/lists', function(req, res){
    var userid = req.params.userId
    model.getLists(userid, function(data){
        res.send({
            data: data
        });
        res.end();
    });
});

app.get('/:userId/lists/:listId', function(req,res){
    var userid = req.params.userId;
    var listid = req.params.listId;
    model.getList(userid,listid,function(listName, data){
        res.send({
            listname : listName,
            data : data
        });
        res.end();
    });
});

app.post('/register', function(req, res){
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    data = {
        email : email,
        pass : password,
        firstName : firstName,
        lastName : lastName
    };  
    model.registerUser(data, function(registered,userId,name){
        if(!registered){
            res.send({
                data: {
                    userId: userId,
                    name : name
                }
            });
            
            res.end();
        }
        else{
            res.send({
                data: 'User with selected username or mail already exists'
            });
            res.end();
        }
    });
});

app.post('/addlist', function(req, res){
    model.insertList(req.body.userId, req.body.listName, req.body.private, function(listId){
        res.send({
            data: "Succesfully added a new list",
            listId : listId
        });
        res.end();
    });
});

app.post('/:listId/additem', function(req, res){
    var item = req.body.item;
    var listid = req.body.listId;
    model.insertListItem(item, listid, function(itemId){
        res.send({
            data: "Succesfully added a new list item",
            itemId : itemId,
            item : item
        });
        res.end();
    });
});

app.delete('/deleteitem/:itemId', function(req, res){
    model.deleteListItem(req.params.itemId, function(){
        res.send({
            data: "List item succesfully deleted"
        });
        res.end();
    });
});

app.delete('/deletelist/:listId', function(req, res){
    model.deleteList(req.params.listId, function(){
        res.send({
            data: "List succesfully deleted"
        });
        res.end();
    });
});

app.put('/check/:itemId',function(req,res){
    model.updateCheck(req.params.itemId, function(updated){
        if(updated){
            res.send({
                message : "Successfuly updated"
            });
        }
        else{
            res.send({
                message : "Error occured"
            })
        }
        res.end();
    });
});

app.put('/important/:itemId',function(req,res){
    model.updateImportant(req.params.itemId, function(updated){
        if(updated){
            res.send({
                message : "Successfully updated"
            });
        }
        else{
            res.send({
                message : "Error occured"
            })
        }
        res.end();
    });
});

app.post('/addUser', function(req,res){
    var email = req.body.email;
    var listId = req.body.listId;
    model.addPersonToList(email, listId, function(inserted){
        if(inserted){
            res.send({
                message:"User " + email + " successfully added"
            });
        }
        else{
            res.send({
                message : "There is no user with that email",
                data:null
            });
        }
        res.end();
    });
});

app.post("/changePassword", function(req,res){
    model.changePassword(req.body.userId, req.body.oldPassword, req.body.newPassword, function(updated){
        if(updated){
            res.send({
                message : "Successfully updated password"
            });
        }
        else{
            res.send({
                message : "Error occured"
            });
        }
        res.end();
    });
});

app.get("/contribution/:listId", function(req,res){
    model.getContribution(req.params.listId, function(contributors){
        res.send({
            data: contributors
        });
        res.end();
    });
});

app.get('/:userId/privateLists', function(req, res){
    var userid = req.params.userId
    model.getPrivateLists(userid, function(data){
        res.send({
            data: data
        });
        res.end();
    });
});

app.get('/:userId/privateLists/:listId', function(req,res){
    var userid = req.params.userId;
    var listid = req.params.listId;
    model.getList(userid,listid,function(listName, data){
        res.send({
            listname : listName,
            data : data
        });
        res.end();
    });
});

var port = process.env.PORT || 3000;
app.get("/favicon.ico",function(req,res){
    res.send();
})
app.listen(port);