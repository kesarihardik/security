const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

app.use(express.urlencoded({extended:true}));  //since bodyparser deprecated. no need to install bodyparser now
app.use(express.json());

app.use(express.static('public'));
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost/userDB',{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//encrypting password using secret string
const secret = "Thisisoursecret";
userSchema.plugin(encrypt, { secret: secret,encryptedFields:['password']});

const User = mongoose.model('User',userSchema);

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/register',(req,res)=>{
    res.render('register');
});


app.post('/register',(req,res)=>{ 
    
    const newUser = new User({
     email: req.body.username,
     password: req.body.password
    });

    newUser.save((err)=>{
        if(err)
        console.log(err);
        else
         res.render('secrets');
    });
});

app.post('/login',(req,res)=>{

    User.findOne({email:req.body.username},(err,founduser)=>{
     if(!err){
       if(founduser.password === req.body.password){
           res.render("secrets");
       }
        else
         res.send('Oops! You have entered an invalid username or password');
       }
     else{
        console.log(err);
     }
      
    });
});

app.listen('3000',()=>{
    console.log('Server started on port 3000');
})