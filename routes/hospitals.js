const express = require('express');
const router = express.Router();

const { getHospitals, getHospital, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitals')
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getHospitals).post(protect, authorize('admin') , createHospital);
router.route('/:hospitalId').get(getHospital).put(protect, authorize('admin'),updateHospital).delete(protect, authorize(['admin']), deleteHospital);

module.exports = router;