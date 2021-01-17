const Internship = require('../model/Reportable');
const internshipDbOps = require('../database_operations/internship_db_operations');
const checkAndHandleBody = require('./bodyChecker');
const typeChecker = require('./checkType');

module.exports = {
    async createNewTask(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId)) {
            next();
            return;    
        }

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
            let internship = await internshipDbOps.retireveInternship(req.params.internshipId, res, next);
            
            if(internship != null) {
                internship.tasks.push(req.body);
                
                internship.save();
    
                res.status(200)
                    .json({
                        success: 'true',
                        data: 'Unavailable for the moment.'
                    });
            }
            
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