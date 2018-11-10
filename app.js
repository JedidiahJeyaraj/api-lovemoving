"use strict";
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

require('./routes/authControllers')(app);
require('./routes/ordersContollers')(app);

if(require.main === module) {
    app.listen(PORT, () => {
        console.log("CFC hospitality food menu upload server running");
    });
  }
  
  module.exports = app;
  



