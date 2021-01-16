const Internship = require('../models/Internship.js');
const typeChecker = require('./checkType.js');
const reccurentFunctions = require('./reccurentFunctions.js');
const checkAndHandleBody = require('./bodyChecker.js');

const basicDatabaseOperations = {
    retrieveInternship : async (req,res) => {
        try {
            const matchingInternship = await Internship.findByPk(req.params.id);
            return matchingInternship; 
            
        } catch (error) {
            reccurentFunctions.handleInternalServerError(error, res);
        }
    },

    createInternship: async (req, res) => {
        try {
            await Internship.create(req.body);

        } catch (error) {
            reccurentFunctions.handleInternalServerError(error, res);
        }
    },

    updateInternship: async (req, res) => {
        try {
            await Internship.update(req.body, {
                where: {
                    id: req.params.id
                }
            });

        } catch (error) {
            reccurentFunctions.handleInternalServerError(error, res);
        }
    },

    deleteInternship: async (req, res) => {
        try {
            await Internship.destroy({
                where: {
                    id: req.params.id
                }
            });

        } catch (error) {
            reccurentFunctions.handleInternalServerError(error, res);
        }
    },
};

const handleRequest = {
    getAllInternships: async (req, res, next) => {
        try {
            const allInternship = await Internship.findAll();
            res.status(200)
                .json({
                    success: 'true',
                    result: allInternship  
                });

        } catch (error) {
            reccurentFunctions.handleInternalServerError(error, res);
        }

        next();
    },

    getInternship: async (req, res, next) => {
        if(! reccurentFunctions.handleIdTypeCheck(req, res)) {
            next();
            return;
        }

        const matchingInternship = await basicDatabaseOperations.retrieveInternship(req, res);
        
        if(matchingInternship === null) {
            res.status(404)
                .json({
                    success: 'false',
                    message: 'Internship not found.'
                });

            next();
            return;
        }

        res.status(200)
            .json({
                success: 'true',
                result: matchingInternship
            });

        next();
    },

    createInternship: async (req, res, next) => {
        const allowedKeys = ["title", "startDate", "description", "endDate"];
        const requiredKeys = ["title", "startDate"];

        if(! checkAndHandleBody(req, res, allowedKeys, requiredKeys)) {
            next();
            return;
        }
        

        // if dates parameters are not in ISO format
        if( ! typeChecker.checkISODate(req.body.startDate) || (req.body.hasOwnProperty('endDate') && ! typeChecker.checkISODate(req.body.endDate))) {
            res.status(400)
                .json({
                    success: false,
                    message: "Date fields needs to be in ISO format."
                });
            next();
            return;
        }

        await basicDatabaseOperations.createInternship(req, res);
        res.status(200)
            .json({
                success: true,
            });
        
        next();
    },

    updateInternship: async (req, res, next) => {
        if(! reccurentFunctions.handleIdTypeCheck(req, res)) {
            next();
            return;
        }

        const internshipToUpdate = await basicDatabaseOperations.retrieveInternship(req, res);
            
        if(internshipToUpdate === null) {
            res.status(404)
                .json({
                    success: false,
                    message: "Internship not found."
                });
                
            next();
            return;
        }

        const allowedKeys = ["title", "startDate", "description", "endDate"];

        if(! checkAndHandleBody(req, res, allowedKeys, [])) {
            next();
            return;
        }

        // if dates parameters are not in ISO format
        if((req.body.hasOwnProperty('startDate') && ! typeChecker.checkISODate(req.body.startDate)) || (req.body.hasOwnProperty('endDate') && ! typeChecker.checkISODate(req.body.endDate))) {
            res.status(400)
                .json({
                    success: false,
                    message: "Date fields needs to be in ISO format."
                });
            next();
            return;
        }

        await basicDatabaseOperations.updateInternship(req, res);
        res.status(200)
            .json({
                success: true,
            });

        next();
    },

    deleteInternship: async (req, res, next) => {
        if(! reccurentFunctions.handleIdTypeCheck(req, res)) {
            next();
            return;
        }

        const internshipToDelete = await basicDatabaseOperations.retrieveInternship(req, res);
            
        if(internshipToDelete === null) {
            res.status(404)
                .json({
                    success: false,
                    message: "Internship not found."
                });
                
            next();
            return;
        }

        await basicDatabaseOperations.deleteInternship(req, res);
        res.status(200)
            .json({
                success: true
            });

        next();
    }
};

module.exports = handleRequest;

