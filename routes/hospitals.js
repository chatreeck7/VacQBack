const express = require('express');
const router = express.Router();
const { getHospitals, getHospital, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitals')

router.route('/').get(getHospitals).post(createHospital);
router.route('/:hospitalId').get(getHospital).put(updateHospital).delete(deleteHospital);

module.exports = router;