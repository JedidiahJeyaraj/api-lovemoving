"use strict";

var db = require('../config/db');

function userModel(){};

userModel.prototype.register = function(done){

    console.log("dasda");
        var conn = db.getConnection();
        var sql = 'insert into users\
        (`id`,`firstname`,`lastname`,`email`,`password`,`phone`,`is_active`, `is_customer_login`)\
         values(0,?,?,?,?,?,?,?)';
         var is_customer_login = (this.is_customer_login == undefined || this.is_customer_login == ''?'0':'1');
        conn.query(sql, [this.firstname,this.lastname,this.email, this.password, this.phone, this.is_active, is_customer_login], function (err, rows, fields) {
            if(err){
                done(err)
            }else done(null,rows);
            conn.end();
        });
};


userModel.prototype.editUser = function(done){

    console.log("dasda");
        var conn = db.getConnection();
        var sql = 'UPDATE users SET user_company = ?,address=?,city=?,zip_code=?,\
        region=?,state=?,user_desc=? WHERE id = ?';
         var values = [
             this.company,
             this.address,
             this.city,
             this.zipcode,
             this.region,
             this.state,
             this.mydesc,
             this.userId
         ]
         ///console.log(values);
        conn.query(sql, values, function (err, rows, fields) {
            if(err){
                done(err)
            }else done(null,rows);
            conn.end();
        });
};

userModel.prototype.updateAvatarPath = function(done){

    console.log("dasda");
        var conn = db.getConnection();
        var sql = 'UPDATE users SET avatar = ? WHERE id = ?';
         var values = [
             this.path,
             this.userId
         ]
         console.log(sql, values);
        conn.query(sql, values, function (err, rows, fields) {
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
userModel.prototype.users = function(done){

    var conn = db.getConnection();
    var sql = 'select * from users ';
    conn.query(sql, [this.email, this.password], function (err, rows, fields) {
        done(err, rows);
        conn.end();
    });

};

userModel.prototype.findById = function(done){

    var conn = db.getConnection();
    var sql = 'select * from users where id=?';
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err, rows);
        conn.end();
    });

};


module.exports =  userModel;

