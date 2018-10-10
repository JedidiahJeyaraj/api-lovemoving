const app = require('express')();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080;
const BASE_ULR = process.env.BASE_ULR || "http://localhost:"+PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

const userModel = require('./models/users');

app.post('/register', function(req, res){

    var userObj = new userModel();
        console.log(req.body);
        // res.send(req.body);
        // return;
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


if(require.main === module) {
    app.listen(PORT, () => {
        console.log("CFC hospitality food menu upload server running");
    });
  }
  
  module.exports = app;
  



