"use strict";

var db = require('../config/db');
function orderModel(){};

orderModel.prototype.createOrder = function(done){
    
    var conn = db.getConnection();
    var sql = 'INSERT INTO lm_orders (\
        lm_ord_user_id,\
         lm_ord_service_type,\
         lm_ord_from,\
         lm_ord_to,\
         lm_ord_from_location_id,\
         lm_ord_to_location_id,\
         lm_ord_date,\
         lm_ord_access_time,\
         lm_ord_comments)\
         VALUES(?,?,?,?,?,?,?,?,?)';
    var values = [
        this.userId,
        this.serviceType,
        this.orderFromDate,
        this.orderToDate,
        this.FromLocation,
        this.ToLocation,
        this.orderDateTime,
        this.accessTime,
        this.orderComments
        ];     
    conn.query(sql, values, function (err, rows, fields) {
        console.log(err, rows);
        done(err,rows.insertId);
        conn.end();
    });
    
};

orderModel.prototype.myOrders = function(done){

    var conn = db.getConnection();
    var sql = 'SELECT  a.lm_lc_name as fromlocation,b.lm_lc_name as tolocation,o.* FROM lm_orders o\
    join lm_locations a on (a.lm_lc_id=o.lm_ord_from_location_id)\
    join lm_locations b on (b.lm_lc_id=o.lm_ord_to_location_id)\
    WHERE o.lm_ord_user_id=?';    
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });

};


orderModel.prototype.myOrdersNotifications = function(done){

    var conn = db.getConnection();
    var sql = 'SELECT * from lm_order_notifications noti\
    join lm_orders ord on (noti.lm_ord_id=ord.lm_ord_id)\
    join users on (id=lm_service_provider_id)\
    where ord.lm_ord_user_id=?';    
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });

};

orderModel.prototype.orderTrackingSearch = function(done){
    
    var conn = db.getConnection();
    var sql = 'SELECT  * FROM lm_orders\
    WHERE lm_ord_user_id=? AND lm_ord_id=?';    
    conn.query(sql, [this.userId, this.orderId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });

};


orderModel.prototype.orderChangeNotification = function(done){
    
    var conn = db.getConnection();
    var sql = 'INSERT INTO lm_order_notifications (\
            lm_ord_id,\
            lm_service_provider_id,\
            lm_order_status)\
            VALUES(?,?,?)';
    var values = [
            this.orderId,
            this.userId,
            this.status
        ];     
    conn.query(sql, values, function (err, rows, fields) {
        console.log(err, rows);
        done(err,rows);
        conn.end();
    });

};

orderModel.prototype.listLocations = function(done){
    
    var conn = db.getConnection();
    var sql = 'SELECT * FROM `lm_locations`';    
    conn.query(sql, function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });

};
orderModel.prototype.users = function(done){

};


module.exports =  orderModel;

