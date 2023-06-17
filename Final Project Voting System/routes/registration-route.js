var express = require('express');
var router = express.Router();
var db=require('../database');
var app = express();
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))

// to display registration form 
router.get('/register', function(req, res, next) {
  res.render('registration-form.ejs');
});


// to store user input detail on post request
router.post('/register', function(req, res, next) {
    var firstname = req.body.first_name;
    var name = firstname.split(" ");
    let inputData ={
        first_name: name[0],
        last_name: name[1],
        email_address: req.body.email_address,
        gender: req.body.gender,
        password: req.body.password,
        confirm_password:req.body.confirm_password
    }
    console.log(inputData);
  
// check unique email address

    var sql='SELECT * FROM user_accounts WHERE email_address =?';
    db.query(sql, [inputData.email_address] ,function (err, data, fields) {
    if(err) throw err
    if(data.length>1){
        var msg = inputData.email_address+ "was already exist";
    
    }else if(inputData.confirm_password != inputData.password){
        var msg ="Password & Confirm Password is not Matched";
    }else{
        
        // save users data into database
        var sql = 'INSERT INTO user_accounts SET ?';
        db.query(sql, inputData, function (err, data) {
            if (err) throw err;
        });
        var msg ="Your are successfully registered";
        }
      res.render('registration-form.ejs',{alertMsg:msg});
    
    })
    
     
});
module.exports = router;

