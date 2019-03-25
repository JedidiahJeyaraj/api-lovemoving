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


orderModel.prototype.getAllStates = function(done){

    var conn = db.getConnection();
    var sql = 'select * from lm_states order by state_name';
    conn.query(sql, function (err, rows, fields) {
        console.log("lm_states", err, rows);
        done(err,rows);
        conn.end();
    });

};

orderModel.prototype.getCities = function(done){

    var conn = db.getConnection();
    var sql = 'select * from lm_cities where lm_state_id=? order by lm_city_name';
    conn.query(sql, [this.state_id], function (err, rows, fields) {
        console.log("lm_cities", err, rows);
        done(err,rows);
        conn.end();
    });

};


orderModel.prototype.getCitiesSubUrbs = function(done){

    var conn = db.getConnection();
    var sql = 'select * from lm_locations where lm_city_id=? order by lm_lc_name';
    conn.query(sql, [this.city_id], function (err, rows, fields) {
        console.log("lm_cities", err, rows);
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
         lm_ord_comments,\
         lm_ord_service_provider)\
         VALUES(?,?,?,?,?,?,?,?,?,?)';
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
        this.serviceProvider
        ];
        console.log(sql, values);     
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

orderModel.prototype.numberOfBookingsInThisYear = function(done){

    var conn = db.getConnection();
    var sql = "SELECT months, COUNT(months) as order_counts from (\
        SELECT DATE_FORMAT(lm_ord_from, '%Y-%m') as months FROM\
        lm_orders WHERE\
        DATE_FORMAT(lm_ord_from, '%Y') = DATE_FORMAT(now(), '%Y') and \
        lm_ord_service_provider=?) as temp\
        GROUP by months order by months";    
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.totalDailyBookings = function(done){

    var conn = db.getConnection();
    var sql = "SELECT count(*) as total_daily_bookings FROM lm_orders\
    WHERE date(created_at)=date(now()) \
    and lm_ord_service_provider=?";    
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};


orderModel.prototype.checkForFeedback = function(done){

    var conn = db.getConnection();
    var sql = 'SELECT COUNT(fd.id) as feedback from lm_cus_feedback_to_sp fd\
    join lm_orders ord on (fd.lm_order_id=ord.lm_ord_id)\
    where ord.lm_ord_user_id=? and fd.lm_order_id=?';    
    conn.query(sql, [this.userId, this.orderId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.serviceProviderOngoingJobs = function(done){

    var conn = db.getConnection();
    var sql = 'select count(lm_ord_id) as count from lm_orders\
    WHERE lm_ord_from>=date(now()) and lm_ord_to<=date(now()) and\
     lm_ord_service_provider=?';
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.serviceProviderRating = function(done){

    var conn = db.getConnection();
    var sql = 'SELECT sum(lm_ord_rating) as sum_of_rating,\
     COUNT(*) as n_rating FROM lm_orders_ratings\
      WHERE lm_service_provider_id=?';
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.serviceProviderRatingByIndivisualUsers = function(done){
    var conn = db.getConnection();
    var sql = 'SELECT lm_user_id,user.firstname as firstname,\
    user.lastname as lastname,ra.created_at as created_at, lm_ord_rating as lm_ord_rating FROM lm_orders_ratings as ra\
    join users user on (user.id=ra.lm_user_id)\
    WHERE lm_service_provider_id=?\
    GROUP BY lm_user_id,firstname,lastname,created_at,lm_ord_rating limit 5';
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.newsfeedIsReviewLeft = function(done){
    var conn = db.getConnection();
    var sql = "SELECT lm_ord_service_type from lm_orders\
    join lm_orders_ratings on (lm_ord_user_id=lm_user_id)\
    where lm_user_id=? and lm_ord_status in ('F', 'D') limit 1";
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};

orderModel.prototype.serviceProviderJobSummaryStatusWise = function(done){
    var conn = db.getConnection();
    var sql = 'SELECT lm_ord_status, count(*) as count from lm_orders\
    where lm_ord_service_provider=?\
    GROUP by lm_ord_status';
    conn.query(sql, [this.userId], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
};


orderModel.prototype.serviceProviderConfirmationPendingJobs = function(done){

    var conn = db.getConnection();
    var sql = 'select count(lm_ord_id) as count from lm_orders\
    WHERE lm_ord_service_provider=? and lm_ord_status=?';
    conn.query(sql, [this.userId, 'S'], function (err, rows, fields) {
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

orderModel.prototype.customerRating = function(customerId, serviceProviderId,ratingStarts,done){
     var conn = db.getConnection();
     var sql = "INSERT INTO lm_orders_ratings\
      (lm_rt_id, lm_user_id, lm_service_provider_id,\
       lm_ord_rating)\
        VALUES (NULL, ?, ?, ?)";    
    console.log("sql", sql);
    conn.query(sql, [customerId, serviceProviderId, ratingStarts], function (err, rows, fields) {
        console.log(err, rows);
        done(err,rows);
        conn.end();
    });
}    

orderModel.prototype.customerFeedback = function(done){

    var conn = db.getConnection();
    var self = this;
    var sql = "INSERT INTO lm_cus_feedback_to_sp\
     (id, lm_order_id, lm_cus_feedback_note)\
      VALUES (NULL, ?, ?)";    
    console.log("sql", sql);
    conn.query(sql, [this.orderid, this.feedback_note], function (err, rows, fields) {
        done(err,rows);
        console.log(self.customerId, self.service_provider, self.numStars);
        self.customerRating(self.customerId, self.service_provider, self.numStars, function(){});
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

orderModel.prototype.getAllServiceProvider = function(done){

    var conn = db.getConnection();
    var sql = "SELECT usr.id as id, CONCAT(usr.firstname,' ', usr.lastname) as fullname,\
    sum(lor.lm_ord_rating) as sum_of_all_ratings,count(lor.lm_rt_id)\
     as number_of_rating FROM users usr\
    left join lm_orders_ratings  lor on (lor.lm_service_provider_id=usr.id)\
    WHERE usr.is_customer_login='2' group by id";    
    conn.query(sql, function (err, rows, fields) {
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

orderModel.prototype.blockCalender = function(done) {
    var conn = db.getConnection();
    var sql = "INSERT INTO `lm_calender` (`lm_cal_id`,\
     `lm_user_id`, `lm_cal_block_date`, `lm_cal_time`)\
      VALUES (NULL, ?, ?, ?)";    
    conn.query(sql, [this.userId, this.date, this.time], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
}

orderModel.prototype.getCalender = function(done) {
    var conn = db.getConnection();
    var sql = "select * from lm_calender where lm_user_id= ? \
    and lm_cal_block_date>=? and lm_cal_block_date<= ? ";    
    conn.query(sql, [this.userId, this.from_date,this.to_date, this.date], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
}

orderModel.prototype.findOrderById = function(done) {
    var conn = db.getConnection();
    var sql = "SELECT  a.lm_lc_name as fromlocation,b.lm_lc_name as tolocation,o.* FROM lm_orders o\
    join lm_locations a on (a.lm_lc_id=o.lm_ord_from_location_id)\
    join lm_locations b on (b.lm_lc_id=o.lm_ord_to_location_id)\
    WHERE o.lm_ord_id=? order by created_at desc";    
    conn.query(sql, [this.orderid], function (err, rows, fields) {
        done(err,rows);
        conn.end();
    });
}

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

