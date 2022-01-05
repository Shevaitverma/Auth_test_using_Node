const router = require('express').Router();
const User = require('../model/user');
const { regesterValidation, loginValidation } = require('../validation');
const bcrypt = require('bcrypt');
const { valid } = require('@hapi/joi');



router.post('/regester', async (req, res)=>{

    //  ----- Validate the data -----

    // const validation = schema.validate(req.body);
    // if(validation.error){
    //     res.status(400).send(validation.error.details[0].message);
    //     return ;
    // }
    const validation = regesterValidation(req.body);
    if(validation.error){
        res.status(400).send(validation.error.details[0].message);
        return ;
    }


    // ----- checking if user is already there -----
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('email already exists!!!');

    // ----- Hash passwords -----
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // ----- Create a new user -----
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user.save()}); 
    } catch (err) {
        res.status(400).send(err);
    }
});

// ----- Login User -----
router.post('/login', async (req,res)=>{
    // ---- validate data before a user ----
    const validation2 = loginValidation(req.body);
    if(validation2.error){
        res.status(400).send(validation2.error.details[0].message);
        // ----- checking if the email exists -----
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Invalid Email or password');
        // ----- password is correct -----
        const validPass = await bcrypt(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Invalid Email or password');
        
        res.send('logged in...');
    }   
    // res.send('sucessfully logged in...')
});

// router.post('/login', async (req, res)=>{
//     // ---- validate data before a user ----
//     const validation2 = loginValidation(req.body);
//     if(validation2.error){
//         res.status(400).send(validation2.error.details[0].message);
//         // ----- checking if the email exists -----
//         const user = await User.findOne({email: req.body.email});
//         if(!user) return res.status(400).send('Invalid Email or password');
//         // ----- password is correct -----
//         const validPass = await bcrypt(req.body.password, user.password);
//         if(!validPass) return res.status(400).send('Invalid Email or password');
        
//         res.send('logged in...');
//     }   
//     // res.send('logged in...')
// });

module.exports = router; 