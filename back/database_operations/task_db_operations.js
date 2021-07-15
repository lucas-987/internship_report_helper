const internshipDbOps = require('./internship_db_operations');

function handleRetrieveInternshipError(internshipWrapper) {
    if(internshipWrapper == null) {
        return {
            success: false,
            resultCode: resultCode.INTERNAL_ERROR
        };
    }

    if(internshipWrapper.resultCode == internshipDbOps.resultCode.OK) {
        return {
            success: true
        };
    }
    else if(internshipWrapper.resultCode == internshipDbOps.resultCode.NOT_FOUND) {
        return {
            success: false,
            resultCode: resultCode.NOT_FOUND
        };
    }
    else {
        return {
            success: false,
            resultCode: resultCode.INTERNAL_ERROR
        };
    }
}

const resultCode = {
    OK: 0,
    NOT_FOUND: 1,
    INTERNAL_ERROR: 2
}

module.exports = {
    resultCode,

    /*
    * Retrieves a task in the database
    * 
    * params : 
    *   internshipId
    *   taskId 
    * 
    * returns:
    *   an object using the following pattern :
    *       {
    *           resultCode: resultCode, // one of the value contained in the 
    *                                  // resultCode object defined in line 3
    *           task: task // the task retrieved from db
    *                      // only if the result code is resultCode.OK
    *       }
    */
    async retrieveTask(internshipId, taskId) {
        let internshipWrapper = await internshipDbOps.retrieveInternship(internshipId);
        let task = null;
        
        let isInternshipRetrieved = handleRetrieveInternshipError(internshipWrapper);
        if(isInternshipRetrieved.success) {
            try {
                task = internshipWrapper.internship.tasks.id(taskId);
    
                if(task == null) {
                    return {
                        resultCode: resultCode.NOT_FOUND
                    };
                }
    
                return {
                    resultCode: resultCode.OK,
                    task: task
                };

            } catch(error) {
                return {
                    resultCode: resultCode.INTERNAL_ERROR
                };
            }
        }
        else {
            return {
                resultCode: isInternshipRetrieved.resultCode
            };
        }
    },
}