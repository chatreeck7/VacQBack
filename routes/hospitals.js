const express = require('express');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({path:'./config/config.env'})

const router = express.Router();

//GET ALL HOSPITALS
router.get('/', (req,res) => {
    res.status(200).json({success:true, msg:"Show all hospitals"});
});
//GET ONE HOSPITAL BY ID
router.get('/:id', (req,res) => {
    res.status(200).json({success:true, msg:`Show hospital: ${req.params.id}`});
});
//POST HOSTITALS
router.post('/', (req,res) => {
    res.status(200).json({success:true, msg:"Create new hospital"});
});
//PUT ONE HOSPITAL
router.put('/:id', (req,res) => {
    res.status(200).json({success:true, msg:`Update hospital: ${req.params.id}`});
});
//DELETE ONE HOSPITAL
router.delete('/:id', (req,res) => {
    res.status(200).json({success:true, msg:`Delete hospital: ${req.params.id}`});
});

module.exports = router;