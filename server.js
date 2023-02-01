const express = require('express');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({path:'./config/config.env'})

const app = express();

app.get('/', (req,res) => {
    res.status(200).json({success:true, data:{id:1}})
});

//GET ALL HOSPITALS
app.get('/api/v1/hospitals', (req,res) => {
    res.status(200).json({success:true, msg:"Show all hospitals"});
});
//GET ONE HOSPITAL BY ID
app.get('/api/v1/hospitals/:id', (req,res) => {
    res.status(200).json({success:true, msg:`Show hospital: ${req.params.id}`});
});
//POST HOSTITALS
app.post('/api/v1/hospitals', (req,res) => {
    res.status(200).json({success:true, msg:"Create new hospital"});
});
//PUT ONE HOSPITAL
app.put('/api/v1/hospitals/:id', (req,res) => {
    res.status(200).json({success:true, msg:`Update hospital: ${req.params.id}`});
});
//DELETE ONE HOSPITAL
app.delete('/api/v1/hospitals/:id', (req,res) => {
    res.status(200).json({success:true, msg:`Delete hospital: ${req.params.id}`});
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV,' mode on_port', PORT))