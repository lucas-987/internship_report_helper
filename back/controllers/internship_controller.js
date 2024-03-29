const Internship = require('../model/Reportable.js');
const internshipDbOps = require('../database_operations/internship_db_operations');
const checkAndHandleBody = require('./tools/bodyChecker');
const typeChecker = require('./tools/checkType');
const errorResponse = require('./tools/errorResponses');

function handleRetrieveInternshipError(result, res) {
    if(result == null) {
        errorResponse.internalError(res);
        return false;
    }

    if(result.resultCode == internshipDbOps.resultCode.OK) {
        return true;
    }
    else if(result.resultCode == internshipDbOps.resultCode.NOT_FOUND) {
        errorResponse.notFound(res);
        return false;
    }
    else {
        errorResponse.internalError(res);
        return false;
    }
}

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
            errorResponse.internalError(res);
            next();    
            return;
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
            let internshipWrapper = await internshipDbOps.retrieveInternship(req.params.id);

            let isInternshipRetrieved = handleRetrieveInternshipError(internshipWrapper, res);
            if(isInternshipRetrieved) {
                res.status(200)
                    .json({
                        success: true,
                        data: internshipWrapper.internship
                    });
    
                next();
            }
            else {
                next();
                return;
            }

        } catch (error) {
            console.log(error.message);
            errorResponse.internalError(res);
            next(); 
            return;
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
            errorResponse.internalError(res);
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
                errorResponse.notFound(res);
                next();
                return; 
            }

            res.status(200)
                .json({
                    success: true
                });

        } catch (error) {
            console.log(error);
            errorResponse.internalError(res);
            next(); 
            return;
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
                errorResponse.notFound(res);
                next();
                return;    
            }

            res.status(200)
                .json({
                    success: true
                });

        } catch (error) {
            console.log(error);
            errorResponse.internalError(res);
            next();    
            return;
        }
    }
}