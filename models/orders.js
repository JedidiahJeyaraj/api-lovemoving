"use strict";

var db = require('../config/db');
function orderModel(){};

orderModel.prototype.orderStatusTracking = function(orderid,status, done){

    console.log("orderid",orderid);
    if(orderid == undefined) {
        done('err');
        return;
    } 
    console.log("insert status log...");   
    var conn = db.getConnection();
    var sql = 'INSERT INTO lm_order_tracking_log (\
        lm_ord_id,\
        lm_ord_status) \
         VALUES(?,?)';
    var values = [
        orderid,
        status,
        ];     
    conn.query(sql, values, function (err, rows, fields) {
        console.log("lm_order_tracking_log", err, rows);
        done(err,rows);
        conn.end();
    });

};

orderModel.prototype.updateOrderStatus = function(orderid,status, done){

    console.log("orderid",orderid);
    if(orderid == undefined) {
        done('err');
        return;
    } 
    console.log("UPDATE updateOrderStatus...");   
    var conn = db.getConnection();
    var sql = 'UPDATE lm_orders\
     SET lm_ord_status = ? WHERE lm_ord_id = ?';
    var values = [
        status,
        orderid
        ];     
    conn.query(sql, values, function (err, rows, fields) {
        console.log("lm_order_tracking_log", err, rows);
        done(err,rows);
        conn.end();
    });

};


orderModel.prototype.createOrder = function(done){
    
    var conn = db.getConnection();
    var self = this;
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
         lm_ord_service_provider\
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
        this.orderComments,
        '4'
        ];     
    conn.query(sql, values, function (err, rows, fields) {
        console.log(err, rows);
        //this.rows = rows;
        //this.rows = rows;
        self.orderStatusTracking(rows.insertId,'S',function(){});
        done(err,rows.insertId);
        conn.end();
    });
    
};

orderModel.prototype.myOrders = function(done){

    var conn = db.getConnection();
    var sql = 'SELECT  a.lm_lc_name as fromlocation,b.lm_lc_name as tolocation,o.* FROM lm_orders o\
    join lm_locations a on (a.lm_lc_id=o.lm_ord_from_location_id)\
    join lm_locations b on (b.lm_lc_id=o.lm_ord_to_location_id)\
    WHERE o.lm_ord_user_id=? order by created_at desc';    
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.newServiceProviders = function(done){

    var conn = db.getConnection();
    var sql = 'SELECT count(id) as service_provider FROM users WHERE is_customer_login=?';    
    console.log("sql", sql);
    conn.query(sql, ['2'], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.todaysOngoingJobs = function(done){

    var conn = db.getConnection();
    var sql = 'SELECT count(lm_ord_id) as todays_ongoing_jobs FROM lm_orders\
        WHERE lm_ord_from>=date(now()) and lm_ord_to<=date(now())\
        and lm_ord_status=? ';    
    console.log("sql", sql);
    conn.query(sql, ['O'], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.newAlerts = function(done){

    var conn = db.getConnection();
    var sql = 'SELECT count(lm_ordn_id) as notification_count from lm_order_notifications ordn\
    JOIN lm_orders ord on (ordn.lm_ord_id=ord.lm_ord_id)\
    where lm_ord_user_id=? and date(ordn.created_at)=date(now())';    
    console.log("sql", sql);
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.customerFeedback = function(done){

    var conn = db.getConnection();
    var sql = "INSERT INTO lm_cus_feedback_to_sp\
     (id, lm_order_id, lm_cus_feedback_note)\
      VALUES (NULL, ?, ?)";    
    console.log("sql", sql);
    conn.query(sql, [this.orderid, this.feedback_note], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.orderServiceProvider = function(done){

    var conn = db.getConnection();
    var sql = 'SELECT  a.lm_lc_name as fromlocation,b.lm_lc_name as tolocation,o.* FROM lm_orders o\
    join lm_locations a on (a.lm_lc_id=o.lm_ord_from_location_id)\
    join lm_locations b on (b.lm_lc_id=o.lm_ord_to_location_id)\
    WHERE o.lm_ord_service_provider=? order by created_at desc';    
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};



orderModel.prototype.getOrderStatusTracking = function(done){

    var conn = db.getConnection();
    var sql = 'select * from lm_order_tracking_log\
    where lm_ord_id=? order by id ';    
    conn.query(sql, [this.orderid], function (err, rows, fields) {
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
    
    var self = this; 
    var orderId = this.orderId;
    var status = this.status;
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
        self.orderStatusTracking(orderId,status,function(){});
        self.updateOrderStatus(orderId,status,function(){});
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

