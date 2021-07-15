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

/*
 *  The 2 "get methods" in this controller will probably not be used
 *  as we will already have tasks when we retrieve all internship. But
 *  since the main goal here is to learn I will still implement them (and
 *  its not a lot of work to do so). 
 */

module.exports = {
    // gets all tasks of an internship
    async getAllTasks(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId)) {
            next();
            return;
        }

        try {
            let internshipWrapper = await internshipDbOps.retrieveInternship(req.params.internshipId);
            
            let isInternshipRetrieved = handleRetrieveInternshipError(internshipWrapper, res);
            if(isInternshipRetrieved) {
    
                res.status(200)
                    .json({
                        success: 'true',
                        data: internshipWrapper.internship.tasks
                    });

                next();    
            }
            else {
                next();
                return;
            }
            
        } catch (error) {
            console.log(error);
            errorResponse.internalError(res);
            next(); 
        }        
    },

    async getTask(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId) 
            || ! typeChecker.handleIdCheck(res, req.params.taskId)) {

               next();
               return; 
        }

        try {
            let internshipWrapper = await internshipDbOps.retrieveInternship(req.params.internshipId);
            
            let isInternshipRetrieved = handleRetrieveInternshipError(internshipWrapper, res);
            if(isInternshipRetrieved) {
    
                let task = internshipWrapper.internship.tasks.id(req.params.taskId);

                if(task == null) {
                    errorResponse.notFound(res);
                    next();
                    return;    
                }

                res.status(200)
                    .json({
                        success: 'true',
                        data: task
                    });

                next();
            }
            else {
                next();
                return;
            }

        } catch (error) {
            console.log(error);
            errorResponse.internalError(res);
            next(); 
            return;
        } 
    },

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
            let internshipWrapper = await internshipDbOps.retrieveInternship(req.params.internshipId, res, next);
            
            let isInternshipRetrieved = handleRetrieveInternshipError(internshipWrapper, res);
            if(isInternshipRetrieved) {
                internshipWrapper.internship.tasks.push(req.body);
                
                internshipWrapper.internship.save();
    
                res.status(200)
                    .json({
                        success: 'true',
                        data: 'Unavailable for the moment.'
                    });

                next();    
            }
            else {
                next(); 
                return;
            }
            
        } catch (error) {
            console.log(error);
            errorResponse.internalError(res);
            next(); 
        }
    },

    async updateTask(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId) 
            || ! typeChecker.handleIdCheck(res, req.params.taskId)) {

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
            let internshipWrapper = await internshipDbOps.retrieveInternship(req.params.internshipId, res, next);
            
            let isInternshipRetrieved = handleRetrieveInternshipError(internshipWrapper, res);
            if(isInternshipRetrieved) {
                let task = internshipWrapper.internship.tasks.id(req.params.taskId);

                if(task == null) {
                    errorResponse.notFound(res);
                    next();
                    return; 
                }

                task = Object.assign(task, req.body)
                internshipWrapper.internship.save();
                
                res.status(200)
                    .json({
                        success: true
                    });

                next();
            }
            else {
                next();
                return;
            }

        } catch (error) {
            console.log(error);
            errorResponse.internalError(res);
            next(); 
            return;
        }
    },

    async deleteTask(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId) 
            || ! typeChecker.handleIdCheck(res, req.params.taskId)) {

               next();
               return; 
        }

        try {
            let internshipWrapper = await internshipDbOps.retrieveInternship(req.params.internshipId);
            
            let isInternshipRetrieved = handleRetrieveInternshipError(internshipWrapper, res);
            if(isInternshipRetrieved) {
                let task = internshipWrapper.internship.tasks.id(req.params.taskId);
                
                if(task == null) {
                    errorResponse.notFound(res);
                    next();
                    return;    
                }
                
                task.remove();
                internshipWrapper.internship.save();

                res.status(200)
                    .json({
                        success: true
                    });

                next();
            }
            else {
                next();
                return;
            }

        } catch (error) {
            console.log(error);
            errorResponse.internalError(res);
            next(); 
            return;
        }
    }
}