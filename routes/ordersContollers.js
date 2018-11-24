"use strict";
const orderModel = require('../models/orders');

var orders = function(app){

    app.post('/create-order', function(req, res){
         var orderObj = new orderModel();
         var body = req.body;
         console.log("body", body);
        //  return;
         orderObj.userId = req.query.userId;
         orderObj.serviceType = body.serviceType;
         orderObj.orderFromDate = body.orderFromDate;
         orderObj.orderToDate = body.orderToDate;
         orderObj.orderDateTime = body.orderDateTime;
         orderObj.FromLocation = body.FromLocation;
         orderObj.ToLocation = body.ToLocation;
         orderObj.orderComments = body.orderComments;
         orderObj.accessTime = body.accessTime;
         orderObj.createOrder(function(error, result){
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
        })  
    });


    app.post('/customer-feedback', function(req, res){
        var orderObj = new orderModel();
        var body = req.body;
        console.log("body", body);
       //  return;
        orderObj.orderid = req.body.orderid;
        orderObj.feedback_note = req.body.feedback_note;
        
        orderObj.customerFeedback(function(error, result){
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
       })  
   });

    app.get('/my-orders/:userid', function(req, res){
        var orderObj = new orderModel();
        orderObj.userId = req.params.userid;
        orderObj.myOrders(function(error, result){
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

    app.get('/new-service-providers', function(req, res){
        var orderObj = new orderModel();
        orderObj.newServiceProviders(function(error, result){
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

    app.get('/todays-ongoing-jobs', function(req, res){
        var orderObj = new orderModel();
        orderObj.todaysOngoingJobs(function(error, result){
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


    app.get('/new-alerts/:userid', function(req, res){
        var orderObj = new orderModel();
        orderObj.userId = req.params.userid
        orderObj.newAlerts(function(error, result){
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

    app.get('/order-service-provider/:userid', function(req, res){
        var orderObj = new orderModel();
        orderObj.userId = req.params.userid;
        orderObj.orderServiceProvider(function(error, result){
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

    app.get('/my-orders-notifications/:userid', function(req, res){
        var orderObj = new orderModel();
        orderObj.userId = req.params.userid;
        orderObj.myOrdersNotifications(function(error, result){
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


    app.get('/order-status-tracking/:orderid', function(req, res){
        var orderObj = new orderModel();
        orderObj.orderid = req.params.orderid;
        orderObj.getOrderStatusTracking(function(error, result){
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

    app.get('/order-tracking-search/:userid/:orderid', function(req, res){
        var orderObj = new orderModel();
        orderObj.userId = req.params.userid;
        orderObj.orderId = req.params.orderid;
        orderObj.orderTrackingSearch(function(error, result){
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

    app.post('/accept-decline-order', function(req, res){
        var orderObj = new orderModel();
        orderObj.userId = req.body.userid;
        orderObj.orderId = req.body.orderid;
        orderObj.status = req.body.status;
        console.log(orderObj);
        orderObj.orderChangeNotification(function(error, result){
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

    app.get('/list-location', function(req, res){
       
        var orderObj = new orderModel();
        orderObj.listLocations(function(error, result){
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

    app.get('/pricing-list', function(req, res){

    });
};

module.exports = orders;