const Internship = require('../model/Reportable.js');
const internshipDbOps = require('../database_operations/internship_db_operations');
const checkAndHandleBody = require('./bodyChecker');
const typeChecker = require('./checkType');

module.exports = {

    getAllInternships: async (req, res, next) => {
        try {
            let internships = await Internship.find({});
    
            res.status(200)
                .json({
                    success: true,
                    data: internships
                });
    
            next();
            
        } catch (error) {
            console.log(error);
            res.status(500)
                .json({
                    success: false,
                    message: 'Internal server error'
                });
            
            next();    
        }
    },

    getInternshipById: async (req, res, next) => {

        // check if it is possible to use a middleware for that
        // and if it is correct to do so
        if(! typeChecker.handleIdCheck(res, req.params.id)) {
            next();
            return;    
        }

        try {
            let internship = await internshipDbOps.retireveInternship(req.params.id, res, next);

            if(internship != null) {
                res.status(200)
                    .json({
                        success: true,
                        data: internship
                    });
    
                next();
            }

        } catch (error) {
            console.log(error.message);
            res.status(500)
                .json({
                    success: false,
                    message: 'Internal server error'
                });
            
            next(); 
        }
    },

    createInternship: async (req, res, next) => {
        const allowedKeys = ["title", "start_date", "description", "end_date"];
        const requiredKeys = ["title", "start_date"];

        if(! checkAndHandleBody(req, res, allowedKeys, requiredKeys)) {
            next();
            return;
        }

        if(! typeChecker.handleDateCheck(req, res, ['start_date', 'end_date'])) { 
            next();
            return;
        }
        
        try {
            let internship = new Internship(req.body);

            await internship.save();

            res.status(200)
                .json({
                    success: true,
                    data: internship
                });

            next();

        } catch (error) {
            console.log(error);
            res.status(500)
                .json({
                    success: false,
                    message: 'Internal server error'
                });
            
            next(); 
        }
    },

    updateInternship: async (req, res, next) => {
        if(! typeChecker.handleIdCheck(res, req.params.id)) {
            next();
            return;    
        }

        const allowedKeys = ["title", "start_date", "description", "end_date"];

        if(! checkAndHandleBody(req, res, allowedKeys, [])) {
            next();
            return;
        }

        if(! typeChecker.handleDateCheck(req, res, ['start_date', 'end_date'])) { 
            next();
            return;
        }

        try {
            let result = await Internship.updateOne({_id: req.params.id},  { $set: req.body });

            if(result.n == 0) {
                res.status(404)
                    .json({
                        success: false,
                        message: 'Internship not found.'
                    });

                next();
                return; 
            }

            res.status(200)
                .json({
                    success: true
                });

        } catch (error) {
            console.log(error);
            res.status(500)
                .json({
                    success: false,
                    message: 'Internal server error'
                });
            
            next(); 
        }
    },

    deleteInternship: async (req, res, next) => {
        if(! typeChecker.handleIdCheck(res, req.params.id)) {
            next();
            return;    
        }

        try {
            let deletedInternship = await Internship.findByIdAndDelete(req.params.id);

            if(deletedInternship === null) {
                res.status(404)
                    .json({
                        success: false,
                        message: 'Internship not found.'
                    });

                next();
                return;    
            }

            res.status(200)
                .json({
                    success: true
                });

        } catch (error) {
            console.log(error);
            res.status(500)
                .json({
                    success: false,
                    message: 'Internal server error'
                });
            
            next();    
        }
    }
}