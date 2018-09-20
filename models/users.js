"use strict";

var db = require('../config/db');

///console.log("db",db.getConnection());

function userModel(){};

userModel.prototype.register = function(done){

    console.log("dasda");
        var conn = db.getConnection();
        var sql = 'insert into users\
        (`id`,`firstname`,`lastname`,`email`,`password`,`phone`,`is_active`)\
         values(0,?,?,?,?,?,?)';
        conn.query(sql, [this.firstname,this.lastname,this.email, this.password, this.phone, this.is_active], function (err, rows, fields) {
            if(err){
                done(err)
            }else done(null,rows);
            conn.end();
        });
};


userModel.prototype.login = function(done){

        var conn = db.getConnection();
        var sql = 'select * from users where email = ? and password=?';
        conn.query(sql, [this.email, this.password], function (err, rows, fields) {
            if(err){
                done(err)
            }else done(null,rows);
            conn.end();
        });

};

module.exports =  userModel;

