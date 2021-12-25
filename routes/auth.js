const router = require('express').Router();
const User = require('../model/user');
const { regesterValidation } = require('../validation');
const bcrypt = require('bcrypt');



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
        res.send(savedUser); 
    } catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router; 