const express = require('express');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({path:'./config/config.env'})

const app = express();

app.get('/', (req,res) => {
    // function that i may want to use it instruction
    // res.send('<h1>Hello from express</h1>');
    // res.send({name:'Brad'});
    // res.json({name:'Brad'});
    // res.sendStatus(400);
    // res.status(400).json({success:false});
    res.status(200).json({success:true, data:{id:1}})
})

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV,' mode on_port', PORT))