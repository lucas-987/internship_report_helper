const Internship = require('../model/Reportable');
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
            let internship = await Internship.findById(req.params.internshipId);
    
            if(internship == null) {
                res.status(404)
                    .json({
                        success: false,
                        message: 'Internship not found.'
                    });

                next();
                return; 
            }

            internship.tasks.push(req.body);
            
            internship.save();

            res.status(200)
                .json({
                    success: 'true',
                    data: 'Unavailable for the moment.'
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