const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//-----import routes-----
const authRoute = require('./routes/auth');

//-----config dotenv-----
dotenv.config({path:'./routes/config.env'});


//-----connect to DB-----
mongoose.connect(process.env.DB).then(()=>{
    console.log('connected to db');
}).catch((err) => console.log('err'));



//-----middlewares-----
app.use(express.json());

//-----Route middlewares-----
app.use('/api/user', authRoute);



app.listen(3000, () => console.log('running...'));