const Hospital = require('../models/Hospital');
const VacCenter = require('../models/VacCenter');

/**
 * @desc    Get all hospitals
 * @route   GET /api/v1/hospitals
 * @access  Public 
 * @query   ?province="province"
 */
exports.getHospitals = async (req,res,next) => {
    try {
        //Copy req.query
        const reqQuery = {...req.query};
        //Fields to exclude
        const removeFields = ['select','sort','page','limit'];

        // Loop over removeFields and delete them from reqQuery to do greater than, less than, etc. first
        removeFields.forEach(param => delete reqQuery[param]);
        console.log(reqQuery);
        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        // \b = boundary : see verbatim string literals
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // parse queryStr to JSON
        query = Hospital.find(JSON.parse(queryStr)).populate('appointments');

        // Select fields
        if(req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        // Sort
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page,10) || 1;
        const limit = parseInt(req.query.limit,10) || 25;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await Hospital.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const hospitals = await query;

        // Pagination result
        const pagination = {};
        if(endIndex < total) {
            pagination.next = {
                page: page+1,limit
            }
        }
        if(startIndex > 0) {
            pagination.prev = {
                page: page-1,limit
            }
        }
        res.status(200).json({
            success:true,
            count:hospitals.length,
            pagination,
            data:hospitals
        });
    } catch (err) {
        res.status(400).json({success:false});
    }
}

/**
 * @desc    Get single hospital
 * @route   GET /api/v1/hospitals/:id
 * @access  Public
 * 
 */
exports.getHospital = async (req,res,next) => {
    try {
        const hospital = await Hospital.findById(req.params.hospitalId);
        if(!hospital) {
            console.log('No hospital found')
            return res.status(400).json({success:false});
        }
        res.status(200).json({
            success:true,
            data:hospital
        });
    } catch (err) {
        res.status(400).json({success:false});
    }
}

//@desc     Create single hospital
//@route    POST /api/v1/hospitals
//@access   Private
exports.createHospital = async (req,res,next) => {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({
        success:true,
        data:hospital
    });
}

//@desc     Update single hospital
//@route    PUT /api/v1/hospitals/:id
//@access   Private
exports.updateHospital = async (req,res,next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.hospitalId
            , req.body, {
                new: true,
                runValidators: true
            });
        if(!hospital) {
            console.log('No hospital found')
            return res.status(400).json({success:false});
        }
        res.status(200).json({
            success:true,
            data:hospital
        });
    } catch (err) {
        res.status(400).json({success:false});
    } 
}

//@desc     Delete single hospital
//@route    DELETE /api/v1/hospitals/:id
//@access   Private
exports.deleteHospital = async (req,res,next) => {
    try {
        const hospital = await Hospital.findById(req.params.hospitalId);

        if(!hospital) {
            console.log('No hospital found')
            return res.status(400).json({success:false});
        } 

        hospital.remove();
        res.status(200).json({
            success:true,
            data:{}
        });
    } catch (err) {
        res.status(400).json(
            {success:false}
        );
    }
}

/**
 * @desc    Get all vacCenters
 * @route   GET /api/v1/hospitals/vacCenters
 * @access  Public
 */
exports.getVacCenters = (req,res,next) => {
    VacCenter.getAll((err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving vacCenters."
            })
        }
        else res.send(data);
    })
}