const express = require('express');
const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {normalizeErrors} = require('../helpers/mongoose')

const User = require('../models/users')
users.use(cors())



users.post('/register', (req, res) =>{
    const today = new Date()
    const userData = { 
        Username: req.body.Username,
        Email: req.body.Email, 
        Password: req.body.Password,
        created: today 
    }
    User.findOne({
        Username: req.body.Username
    })
    .then(user =>{
        if(!user) {
            (bcrypt.hash(req.body.Password, 10, (err, hash) => {
                userData.Password = hash
                User.create(userData)
                .then(user => {
                    res.json({status:user.Email + 'Registered..'})
                })
                .catch(err =>{
                    res.send('Error:' + err)
                })
            })) 
                
        }
    })
})

// Login....

users.post('/login', (req,res)=>{
    User.findOne({
        Username: req.body.Username
    })
    .then(user =>{
        if(user) {
            if(bcrypt.compareSync(req.body.Password, user.Password)) {
                const token = jwt.sign({
                    userId:user.id,
                    Username:user.Username
                }, 'SECRETE_KEY', { expiresIn: '1h' });
                res.cookie(token)
                return res.json(token)
    
            }else{
                return res.status(422).send({errors: [{title: 'Wrong Detail!', detail: 'Wrong username or password!'}]});
            }
        }
    })
    .catch(err =>{
        return res.status(422).send({errors: normalizeErrors(err.errors)});

})
})

// Profile....

users.get('/profile', (req, res, next)=>{
    let token=req.headers.cookie.split(' ')
    token=token[token.length-1].slice(0,-10)
    token=jwt.verify(token,'SECRETE_KEY')
    if(token){   
        const user = token;
        User.findById(user.userId,function(err,user){
        if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});

        }
        if(user){
            res.send(user)
            next();
        }else{
            return notAuthorized(res);
        }
        })

    }else{
        return notAuthorized(res);
    }

    function notAuthorized(res){
        return res.status(401).send({errors: [{title: 'Not authorized!', detail: 'You need to login to get access!'}]})
    }
})


module.exports = users;


