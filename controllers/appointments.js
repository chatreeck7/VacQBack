const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

/**
 * @desc    Get all appointments
 * @route   GET /api/v1/appointments
 * @access  Private
 */
exports.getAppointments = async (req, res, next) => {
    let query;
    // Check the permission of the user
    if (req.user.role === 'admin') {
        query = Appointment.find().populate({
            path: 'hospital',
            select: 'name province tel'
        });
    }
    else {
        query = Appointment.find({ user: req.user.id}).populate({
            path: 'hospital',
            select: 'name province tel'
        });
    }

    try {
        const appointments = await query;
        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            error: 'Connot find appointments'
        })
    }

}

/**
 * @desc   Get single appointment 
 * @route  GET /api/v1/appointments/:apptID
 * @param  {String} apptId
 * @access Public
 */
exports.getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.apptId).populate({
            path: 'hospital',
            select: 'name province tel'
        });

        if(!appointment) {
            return res.status(404).json({
                success: false,
                message: `No appointment with the id of ${req.params.apptId}`
            })
        }
        res.status(200).json({
            success: true,
            data: appointment
        })
    }catch(err){
        console.log(err.stackk);
        return res.status(500).json({
            success: false,
            message: 'Cannot find Appointment'
        })
    }
}

/**
 * @desc    Create new appointment
 * @route   POST /api/v1/hospitals/:hospitalId/appointments
 * @param   {String} hospitalId
 * @access  Private
 * 
 */
exports.addAppointment = async (req, res, next) => {
    try{
        req.body.hospital = req.params.hospitalId;

        const hospital = await Hospital.findById(req.params.hospitalId);

        if(!hospital) {
            return res.status(404).json({
                success: false,
                message: `No hospital with the id of ${req.params.hospitalId}`
            })
        }
        console.log(req.body);
        //add user to req.body
        req.body.user = req.user.id;
        //Check for existing appointment
        const existingAppointment = await Appointment.find({ user: req.user.id });
        //If the user is not an admin,they can only create 3 appointment.
        if (existingAppointment.length > 3 && req.user.role !== "admin") {
          return res.status(400).json({
            success: false,
            message: `The user with ID ${req.user.id} has already made 3 appointments`,
          });
        }
        
        const appointment = await Appointment.create(req.body);
        res.status(200).json({
            success: true,
            data: appointment
        });

    }catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: 'Cannot create appointment'
        })
    }
}

/**
 * @desc    Update appointment
 * @route   PUT /api/v1/appointments/:apptId
 * @param   {String} apptId
 * @access  Private
 * 
 */
exports.updateAppointment = async (req, res, next) => {
    try {
      let appointment = await Appointment.findById(req.params.apptId);
  
      if (!appointment) {
        return res
          .status(404)
          .json({ success: false, message: `No appt with id ${req.params.apptId}` });
      }

      //Make sure user is appointment owner
      if (
            appointment.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res
            .status(401)
            .json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this appointment`,
            });
        }
  
      appointment = await Appointment.findByIdAndUpdate(req.params.apptId, req.body, {
        new: true,
        runValidators: true,
      });
  
      res.status(200).json({ success: true, data: appointment });
    } catch (err) {
      console.log(err.stack);
      return res
        .status(500)
        .json({ success: false, message: "Cannot update Appointment" });
    }
  };

  /** 
   * @desc    Delete appointment
   * @route   DELETE /api/v1/appointments/:apptId
   * @param   {String} apptId
   * @access  Private
   * 
   */
exports.deleteAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.apptId);
    
        if (!appointment) {
            return res
              .status(404)
              .json({ success: false, message: `No appt with id ${req.params.apptId}` });
          }

        //Make sure user is appointment owner
        if (
            appointment.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
            success: false,
            message: `User ${req.user.id} is not authorized to delete this appointment`,
            });
        }
  
          await appointment.remove();
      
          res.status(200).json({ success: true, data: {} });
    } catch (err) {
          console.log(err.stack);
          return res
            .status(500)
            .json({ success: false, message: "Cannot delete Appointment" });
    }
}
