const mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection({
    host     : 'sql7.freemysqlhosting.net',
    user     : 'sql7274760',
    password : 'dPYATpUrh8',
    database : 'sql7274760'
});

function checkLoginCredentials(email,password,callback){
    query = 'SELECT mail, password, userId,firstName,lastName FROM users WHERE mail = ' + mysql.escape(email);
    connection.query(query, function(error, data){
        if(error) throw error;
        if(data.length==1){
            bcrypt.compare(password, data[0].password.toString('utf-8'), function(error, res){
                if(error) throw error;
                if(res){
                    callback(res, data[0].userId, data[0].firstName +" " +data[0].lastName)
                }
            });
        }
        else callback(false,null)
    });
}

function getLists(userId, callback){
    query = 'SELECT listId FROM usersandlists WHERE userId = ' + mysql.escape(userId);
    connection.query(query, function(error, data){
        if(error) throw error;
        listIds = [];
        data.forEach(element => {
            listIds.push(element.listId);
        });
        if(listIds.length == 0){
            callback(null);
            return;
        }
        query = 'SELECT listId, listName FROM lists WHERE listId IN (' + listIds.join() + ') AND Private = 0';
        connection.query(query, function(error, data){
            if(error) throw error;
            callback(data);
        });
    })
}

function getList(userId, listId, callback){
    query = 'SELECT listId FROM usersandlists WHERE userId = ' + mysql.escape(userId);
    connection.query(query, function(error, data){
        if(error) throw error;
        listIds = [];
        data.forEach(element => {
            listIds.push(element.listId);
        });
        if(listIds.length == 0){
            callback(null);
            return;
        }
        if(listIds.includes(parseInt(listId,10))){
            query = 'SELECT listName FROM lists WHERE listId = ' + mysql.escape(listId);
            connection.query(query, function(error, data){
                if(error) throw error;
                getListItems(listId, data[0].listName, callback);
            });
        }
    })
}

function getListItems(listId, listName, callback){
    query = 'SELECT itemId FROM listsanditems WHERE listId = ' + mysql.escape(listId);
    connection.query(query, function(error, data){
        if(error) throw error;
        itemIds = [];
        data.forEach(element => {
            itemIds.push(element.itemId);
        });
        if(itemIds.length == 0){
            callback(listName,[]);
            return;
        }
        query = 'SELECT * FROM items WHERE itemId IN (' + itemIds.join() + ')';
        connection.query(query, function(error, data){
            if(error) throw error;
            callback(listName,data);
        });
    });
}

function registerUser(user, callback){
    query = 'SELECT COUNT(*) as numberOfUsers FROM users WHERE mail = ' + mysql.escape(user.email);
    connection.query(query, function(error, data){
        if(error) throw error;
        if(data[0].numberOfUsers != 0){
            callback(true);
        }
        else{
            bcrypt.genSalt(10, function(error, salt){
                if(error) throw error;
                bcrypt.hash(user.pass, salt,null, function(error, hash){
                    if(error) throw error;
                    query = 'INSERT INTO users (firstName, lastName, password, mail) VALUES (' + mysql.escape(user.firstName) + ',' + mysql.escape(user.lastName) + ',' 
                     + mysql.escape(hash) + ',' + mysql.escape(user.email) + ')';
                    connection.query(query, function(error){
                        if(error) throw error;
                        query = "SELECT MAX(userId) as lastId FROM users";
                        connection.query(query, function(error, data){ 
                            if(error) throw error;                          
                            callback(false, data[0].lastId, user.firstName +" " +user.lastName);
                        })
                    });
                });
            });
        }
    });  
}

function insertList(userId, listName,privateList, callback){
    query = 'INSERT INTO lists ( listName, Private) VALUES (' + mysql.escape(listName) + ',' + mysql.escape(privateList) + ')';
    connection.query(query, function(error){
        if(error) throw error;
        query = 'SELECT MAX(listId) as lastId FROM lists';
        connection.query(query, function(error, data){
            if(error) throw error;
            id = data[0].lastId;
            query = 'INSERT INTO usersandlists (userId, listId) VALUES (' + mysql.escape(userId) + ',' + mysql.escape(id) + ')';
            connection.query(query, function(error){
                if(error) throw error;
                callback(id);
            });
        });        
    });
}

function insertListItem(item, listId, callback){
    query = 'INSERT INTO items (itemContent, hasGeo, Latitude, Longitude, userId) VALUES ('  + mysql.escape(item.content) + ',' +
    mysql.escape(item.hasGeo)+',' + mysql.escape(item.lat)+',' + mysql.escape(item.lng) + ',' + mysql.escape(item.userId) + ')';
    connection.query(query, function(error){
        if(error) throw error;
        query = 'SELECT MAX(itemId) as lastId FROM items';
        connection.query(query, function(error, data){
            if(error) throw error;
            query = 'INSERT INTO listsanditems (itemId, listId) VALUES (' + mysql.escape(data[0].lastId) + ',' + mysql.escape(listId) + ')';
            connection.query(query, function(error){
                if(error) throw error;
                callback(data[0].lastId);
            })
        });
    });
}

function deleteListItem(itemId, callback){
    query = 'DELETE FROM items WHERE itemId = ' + mysql.escape(itemId);
    connection.query(query, function(error){
        if(error) throw error;
        query = 'DELETE FROM listsanditems WHERE itemId = ' + mysql.escape(itemId);
        connection.query(query, function(error){
            if(error) throw error;
            callback();
        });
    });
}

function deleteList(listId, callback){
    query = 'DELETE FROM lists WHERE listId = ' + mysql.escape(listId);
    connection.query(query, function(error){
        if(error) throw error;
        query = 'DELETE FROM usersandlists WHERE listId = ' + mysql.escape(listId);
        connection.query(query, function(error){
            if(error) throw error;
            query = 'SELECT itemId FROM listsanditems WHERE listId = ' + mysql.escape(listId);
            connection.query(query, function(error, data){
                if(error) throw error;
                itemIds = [];
                data.forEach(element => {
                    itemIds.push(element.itemId);
                });
                if(itemIds.length == 0){
                    return;
                }
                query = 'DELETE FROM items WHERE itemId IN (' +  itemIds.join() + ')';
                connection.query(query, function(error){
                    if(error) throw error;
                });
            });
            query = 'DELETE FROM listsanditems WHERE listId = ' + mysql.escape(listId);
            connection.query(query, function(error){
                if(error) throw error;
                callback();
            });
        });
    });
}

function updateCheck(itemId, callback){
    query = "SELECT Done FROM items WHERE itemId = " + mysql.escape(itemId);
    connection.query(query, function(error,data){
        if(error) throw error;
        var done = data[0].Done;
        done = Math.abs(1-done);
        query = "UPDATE items SET Done = " + mysql.escape(done) + " WHERE itemId = " + mysql.escape(itemId);
        connection.query(query, function(error, res){
            if(error) throw error;
            callback(res);
        });
    });
}

function updateImportant(itemId, callback){
    query = "SELECT Important FROM items WHERE itemId = " + mysql.escape(itemId);
    connection.query(query, function(error,data){
        if(error) throw error;
        var Important = data[0].Important;
        Important = Math.abs(1-Important);
        query = "UPDATE items SET Important = " + mysql.escape(Important) + " WHERE itemId = " + mysql.escape(itemId);
        connection.query(query, function(error, res){
            if(error) throw error;
            callback(res);
        });
    });
}

function addPersonToList(email, listId, callback){
    query = "SELECT userId FROM users WHERE mail = " + mysql.escape(email);
    connection.query(query, function(error, data){
        if(error) throw error;
        if(data.length !== 0){
        query = "SELECT userId, listId FROM usersandlists WHERE userId = " + mysql.escape(data[0].userId) + " AND listId = " + mysql.escape(listId);
        connection.query(query, function(error, exists){
            if(error) throw error;
            if(exists.length == 0){
                query = "INSERT INTO usersandlists (userId, listId) VALUES ( " + mysql.escape(data[0].userId) + ',' + mysql.escape(listId) + ')';
                connection.query(query, function(error, res){
                    if(error) throw error;
                    callback(res);
                });
            }
        })
    }   
    });
        
}

function changePassword(userId, oldPassword, newPassword,callback){
    query = "SELECT password FROM users WHERE userId = " + mysql.escape(userId);
    connection.query(query, function(error,data){
        if(error) throw error;
        bcrypt.compare(oldPassword,data[0].password.toString('utf-8'),function(error, res){
            if(error) throw error;
            if(res){
                bcrypt.genSalt(10, function(error, salt){
                    if(error) throw error;
                    bcrypt.hash(newPassword, salt,null, function(error, hash){
                        if(error) throw error;
                        query = "UPDATE users SET password = " + mysql.escape(hash) + "WHERE userId = " + mysql.escape(userId);
                        connection.query(query, function(error){
                            if(error) throw error;
                            callback(true);
                        });
                    });
                });
            }
            else callback(false);
        })
    });
}

function getContribution(listId,callback){
    query = "SELECT listName FROM lists WHERE listId = " + mysql.escape(listId);
    connection.query(query, function(error, data){
        if(error) throw error;
        getListItems(listId,data[0].listName, function(listName, data){
            var userIds = [];
            data.forEach((element)=>{
                userIds.push(element.userId);
            });
            if(userIds.length == 0){
                callback({});
                return;
            }
            query = "SELECT firstName, lastName, userId FROM users WHERE userId  IN (" +  userIds.join() + ')'
            connection.query(query, function(error, data){
                if(error) throw error;
                var contributors = {};
                data.forEach((element)=>{
                    contributors[element.firstName + " " + element.lastName] = 0;                    
                });
                userIds.forEach((item)=>{
                    data.forEach((person)=>{
                        if(person.userId === item)  contributors[person.firstName + " " + person.lastName]++;
                    });
                });
                callback(contributors);
            })
        });
    });
}

function getPrivateLists(userId, callback){
    query = 'SELECT listId FROM usersandlists WHERE userId = ' + mysql.escape(userId);
    connection.query(query, function(error, data){
        if(error) throw error;
        listIds = [];
        data.forEach(element => {
            listIds.push(element.listId);
        });
        if(listIds.length == 0){
            callback(null);
            return;
        }
        query = 'SELECT listId, listName FROM lists WHERE listId IN (' + listIds.join() + ') AND Private = 1';
        connection.query(query, function(error, data){
            if(error) throw error;
            callback(data);
        });
    })
}

function getPrivateList(userId, listId, callback){
    query = 'SELECT listId FROM usersandlists WHERE userId = ' + mysql.escape(userId);
    connection.query(query, function(error, data){
        if(error) throw error;
        listIds = [];
        data.forEach(element => {
            listIds.push(element.listId);
        });
        if(listIds.includes(parseInt(listId,10))){
            query = 'SELECT listName FROM lists WHERE listId = ' + mysql.escape(listId);
            connection.query(query, function(error, data){
                if(error) throw error;
                getListItems(listId, data[0].listName, callback);
            });
        }
    })
}

module.exports = {
    getLists : getLists,
    checkLoginCredentials : checkLoginCredentials,
    getList : getList,
    registerUser : registerUser,
    insertList : insertList,
    insertListItem : insertListItem,
    deleteList : deleteList,
    deleteListItem : deleteListItem,
    updateCheck : updateCheck,
    updateImportant : updateImportant,
    addPersonToList : addPersonToList,
    changePassword : changePassword,
    getContribution : getContribution,
    getPrivateLists : getPrivateLists
}