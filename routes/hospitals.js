const express = require('express');
const router = express.Router();

const { getHospitals, getHospital, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitals')
const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const appointmentRouter = require('./appointments');

router.route('/').get(getHospitals).post(protect, authorize('admin') , createHospital);
router.route('/:hospitalId').get(getHospital).put(protect, authorize('admin'),updateHospital).delete(protect, authorize(('admin')), deleteHospital);
router.use('/:hospitalId/appointments', appointmentRouter);

module.exports = router;