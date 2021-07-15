const { response } = require('express');
const taskDbOps = require('../database_operations/task_db_operations');
const checkAndHandleBody = require('./tools/bodyChecker');
const typeChecker = require('./tools/checkType');
const errorResponse = require('./tools/errorResponses');

function handleRetrieveTaskError(result, res) {
    if(result == null) {
        errorResponse.internalError(res);
        return false;
    }

    if(result.resultCode == taskDbOps.resultCode.OK) {
        return true;
    }
    else if(result.resultCode == taskDbOps.resultCode.NOT_FOUND) {
        errorResponse.notFound(res);
        return false;
    }
    else if(result.resultCode == taskDbOps.resultCode.INTERNAL_ERROR) {
        errorResponse.internalError(res);
        return false;
    }
    else {
        errorResponse.internalError(res);
        return false;
    }
}

module.exports = {
    async getAllActions(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId)
            || ! typeChecker.handleIdCheck(res, req.params.taskId)) {

            next();
            return;
        }

        internalError = false;
        try {
            let taskWrapper = await taskDbOps.retrieveTask(req.params.internshipId, req.params.taskId);
            
            let isTaskRetrieved = handleRetrieveTaskError(taskWrapper, res);
            if(isTaskRetrieved) {
    
                res.status(200)
                    .json({
                        success: true,
                        data: taskWrapper.task.actions
                    });

                next();
                return;   
            }
            else {
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

    async getAction(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId)
            || ! typeChecker.handleIdCheck(res, req.params.taskId)
            || ! typeChecker.handleIdCheck(res, req.params.actionId)) {

            next();
            return;
        }

        try {
            let taskWrapper = await taskDbOps.retrieveTask(req.params.internshipId, req.params.taskId);
            
            let isTaskRetrieved = handleRetrieveTaskError(taskWrapper, res);
            if(isTaskRetrieved) {
    
                let action = taskWrapper.task.actions.id(req.params.actionId);

                if(action == null) {
                    errorResponse.notFound(res);
                    next();
                    return;
                }

                res.status(200)
                    .json({
                        success: 'true',
                        data: action
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

    async createNewAction(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId)
            || ! typeChecker.handleIdCheck(res, req.params.taskId)) {

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
            let taskWrapper = await taskDbOps.retrieveTask(req.params.internshipId, req.params.taskId);
            
            let isTaskRetrieved = handleRetrieveTaskError(taskWrapper, res);
            if(isTaskRetrieved) {
                taskWrapper.task.actions.push(req.body);
                
                taskWrapper.task.parent().save();
    
                res.status(200)
                    .json({
                        success: 'true',
                        data: 'Unavailable for the moment.'
                    });

                next();    
            }
            else{
                next();
                return;
            }
            
        } catch (error) {
            console.log(error);
            errorResponse.internalError(res);
            next(); 
        }
    },

    async updateAction(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId)
            || ! typeChecker.handleIdCheck(res, req.params.taskId)
            || ! typeChecker.handleIdCheck(res, req.params.actionId)) {

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
            let taskWrapper = await taskDbOps.retrieveTask(req.params.internshipId, req.params.taskId);
            
            let isTaskRetrieved = handleRetrieveTaskError(taskWrapper, res);
            if(isTaskRetrieved) {
                let action = taskWrapper.task.actions.id(req.params.actionId);

                if(action == null) {
                    errorResponse.notFound(res);
                    next();
                    return;    
                }

                action = Object.assign(action, req.body)
                taskWrapper.task.parent().save();
                
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

    async deleteAction(req, res, next) {
        if(! typeChecker.handleIdCheck(res, req.params.internshipId)
            || ! typeChecker.handleIdCheck(res, req.params.taskId)
            || ! typeChecker.handleIdCheck(res, req.params.actionId)) {

            next();
            return;
        }

        try {
            let taskWrapper = await taskDbOps.retrieveTask(req.params.internshipId, req.params.taskId);
            
            let isTaskRetrieved = handleRetrieveTaskError(taskWrapper, res);
            if(isTaskRetrieved) {
                let action = taskWrapper.task.actions.id(req.params.actionId);
                
                if(action == null) {
                    errorResponse.notFound(res);
                    next();
                    return;    
                }
                
                action.remove();
                taskWrapper.task.parent().save();

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