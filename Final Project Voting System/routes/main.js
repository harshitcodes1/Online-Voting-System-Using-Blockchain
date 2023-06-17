var express = require('express');
var router = express.Router();
//const dotevn = require("dotevn");
//dotevn.config();


/* GET users listing. */
// const express=require('express');
// const app=express()
var conn=require('../database');
router.get('/form', function(req, res, next) {
  // res.render('voter-registration.ejs');
  if(req.session.loggedinUser){
    res.render('voter-registration.ejs')
  }else{
    res.redirect('/login');
  }
});


var getAge = require('get-age');
var nodemailer = require('nodemailer');
var rand=Math.floor((Math.random() * 10000) + 54);
/*let transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: process.env.SMTP_PORT,
   secure: false,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });*/

var account_address;
var data;

router.post('/registerdata',function(req,res){
    var dob=[];
    data=req.body.aadharno;    //data stores aadhar no
    console.log(data);
    account_address=req.body.account_address;     //stores metamask acc address
    //console.log(data);
    let sql = "SELECT * FROM aadhar_info WHERE Aadharno = ?" ;   
    conn.query(sql, data, (error, results, fields) => {
        if (error) {
          return console.error(error.message);
        }
        console.log(results);
        dob = results[0].dob;
        var email=results[0].email_address;
        age = getAge(dob);
        is_registerd=results[0].is_registered;
        if (is_registerd!='YES')
        {
          if (age>=18)
          {
            console.log(rand);
                /*var mailOptions = {
                  from: process.env.SMTP_PASSWORD,
                  to: email,
                  subject : "Please confirm your Email account",
                  text : "Hello, Your otp is "+rand	
                };
              transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } 
                  else {
                    console.log('Email sent: ' + info.response);
                  }
            });*/
            res.render('emailverify.ejs');
          }
          else
          {
            res.send('You cannot vote as your age is less than 18');
          }
        }
        else    //IF USER ALREADY REGISTERED
        {
          res.render('voter-registration.ejs',{alertMsg:"You are already registered. You cannot register again"});
        }
        
    });

    //console.log(dob);
    //console.log(age);
    //res.send("ok")
    //console.log(dob);
})

router.post('/otpverify', (req, res) => {
    var otp = req.body.otp;
    if (otp==rand) 
    {
        var record= {Account_address: account_address, is_registered : 'Yes' };
        var sql="INSERT INTO registered_users SET ?";
        conn.query(sql,record, function(err2,res2)
          {
              if (err2){
             throw err2;
            }
              else{
                var sql1="Update aadhar_info set is_registered=? Where Aadharno=?";
                var record1=['YES',data]
                console.log(data)
                conn.query(sql1,record1, function(err1,res1)
                {
                   if (err1) {
                    res.render('voter-registration.ejs');
                   }
                   else{
                    console.log("1 record updated");
                    var msg = "You are successfully registered";
                    // res.send('You are successfully registered');
                    res.render('voter-registration.ejs',{alertMsg:msg});                 
                  }
                }); 
               
              }
          }); 
    }
    else 
    {
       res.render('voter-registration.ejs',{alertMsg:"Session Expired! , You have entered wronge OTP "});
    }
})



// router.get('/register',function(req,res){
//     res.sendFile(__dirname+'/views/index.html')
// });

/*app.get('/signin_signup',function(req,res){
    res.sendFile(__dirname+'/views/signup.html')
});

app.get('/signup',function(req,res){
    console.log(req.body);
    res.sendFile(__dirname+'/views/signup.html')
});*/

module.exports = router;