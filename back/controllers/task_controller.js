const internshipDbOps = require('../database_operations/internship_db_operations');
const checkAndHandleBody = require('./bodyChecker');
const typeChecker = require('./checkType');

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
            let internship = await internshipDbOps.retireveInternship(req.params.internshipId, res, next);
            
            if(internship != null) {
    
                res.status(200)
                    .json({
                        success: 'true',
                        data: internship.tasks
                    });

                next();    
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
    },

    async getTask(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId) 
            || ! typeChecker.handleIdCheck(res, req.params.taskId)) {

               next();
               return; 
        }

        try {
            let internship = await internshipDbOps.retireveInternship(req.params.internshipId, res, next);
            
            if(internship != null) {
    
                let task = internship.tasks.id(req.params.taskId);

                if(task == null) {
                    res.status(404)
                        .json({
                            success: false,
                            message: 'Task not found.'
                        });

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

                next();    
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
            let internship = await internshipDbOps.retireveInternship(req.params.internshipId, res, next);
            
            if(internship != null) {
                let task = internship.tasks.id(req.params.taskId);

                if(task == null) {
                    res.status(404)
                        .json({
                            success: false,
                            message: 'Task not found.'
                        });

                    next();
                    return;    
                }

                task = Object.assign(task, req.body)
                internship.save();
                
                res.status(200)
                    .json({
                        success: true
                    });

                next();
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
    },

    async deleteTask(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId) 
            || ! typeChecker.handleIdCheck(res, req.params.taskId)) {

               next();
               return; 
        }

        try {
            let internship = await internshipDbOps.retireveInternship(req.params.internshipId, res, next);
            
            if(internship != null) {
                let task = internship.tasks.id(req.params.taskId);
                
                if(task == null) {
                    res.status(404)
                        .json({
                            success: false,
                            message: 'Task not found.'
                        });

                    next();
                    return;    
                }
                
                task.remove();
                internship.save();

                res.status(200)
                    .json({
                        success: true
                    });

                next();
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