"use strict";
const userModel = require('../models/users');

var auth = function(app){

    app.post('/register', function(req, res){

        var userObj = new userModel();
            console.log(req.body);
            userObj.firstname = req.body.fname;
            userObj.lastname = req.body.lname;
            userObj.email = req.body.email;
            userObj.phone = req.body.phone;
            userObj.password = req.body.password;
            userObj.is_active = '1';
            userObj.is_customer_login = req.body.is_customer_login;
            userObj.register(function(error, result){
                if (error) {
                    res.send({
                        error:error
                    });
                }
                else{
                    res.send({
                        result:result
                    });
                }
            });
    });

    app.post('/login', function(req, res){

        var userObj = new userModel();
        userObj.email = req.body.email;
        userObj.password = req.body.phone;
        console.log(req.body);
        userObj.login(function(error, result){
            if (error) {
                res.send({
                    error:error
                });
            }
            else{
                res.send({
                    result:result
                });
            }
        });
    });

    app.get('/users-list', function(req, res){

        var userObj = new userModel();    
        userObj.users(function(error, result){
            if (error) {
                res.send({
                    error:error
                });
            }
            else{
                res.send({
                    result:result
                });
            }
        });
    });
};

module.exports = auth;