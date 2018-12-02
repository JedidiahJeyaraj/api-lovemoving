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


    app.post('/edit-user', function(req, res){

        var userObj = new userModel();
        userObj.company = req.body.company;
        userObj.address = req.body.address;
        userObj.city = req.body.city;
        userObj.zipcode = req.body.zipcode;
        userObj.region = req.body.region;
        userObj.state = req.body.state;
        userObj.mydesc = req.body.mydesc;
        userObj.userId = req.body.userid;
        console.log(req.body);
        userObj.editUser(function(error, result){
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

    app.get('/users/:userid', function(req, res){

        var userObj = new userModel();
            userObj.userId = req.params.userid;    
        userObj.findById(function(error, result){
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