const express = require("express");
const router = express.Router();

const {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  getVacCenters,
} = require("../controllers/hospitals");
const { protect, authorize } = require("../middleware/auth");

// Include other resource routers
const appointmentRouter = require("./appointments");

router
  .route("/")
  .get(getHospitals)
  .post(protect, authorize("admin"), createHospital);
router.route("/vacCenters").get(getVacCenters);
router
  .route("/:hospitalId")
  .get(getHospital)
  .put(protect, authorize("admin"), updateHospital)
  .delete(protect, authorize("admin"), deleteHospital);
router.use("/:hospitalId/appointments", appointmentRouter);

/**
 * @swagger
 * components:
 *      schemas:
 *          Hospital:
 *              type: object
 *              required:
 *                  - name
 *                  - address
 *              properties:
 *                  id:
 *                      type: string
 *                      format: uuid
 *                      description: The auto-generated id of the hospital
 *                      example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *                  ลําดับ:
 *                      type: string
 *                      description: Ordinal number
 *                  name:
 *                      type: string
 *                      description: Hospital name
 *                  address:
 *                      type: string
 *                      description: House No., Street, Road
 *                  district:
 *                      type: string
 *                      description: District
 *                  province:
 *                      type: string
 *                      description: province
 *                  postalcode:
 *                      type: string
 *                      description: 5-digit postal code
 *                  tel:
 *                      type: string
 *                      description: telephone number
 *                  region:
 *                      type: string
 *                      description: region
 *              example:
 *                  id: 609bda561452242d88d36e37
 *                  ลําดับ: )*)
 *                  name: Happy Hospital
 *                  address: 121 ถ.สุขุมวิท
 *                  district: บางนา
 *                  province: กรุงเทพมหานคร
 *                  postalcode: 10110
 *                  tel: 02-2187000
 *                  region: กรุงเทพมหานคร (Bangkok)
 */

module.exports = router;
