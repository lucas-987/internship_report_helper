const Internship = require('../model/Reportable');

const resultCode = {
    OK: 0,
    NOT_FOUND: 1
}

module.exports = {
    resultCode,

    /*
    * Retrieves an Internship in the database
    * 
    * params : 
    *   id : id of the internship  
    * 
    * returns:
    *   an object using the following pattern :
    *       {
    *           resultCode: resultCode, // one of the value contained in the 
    *                                  // resultCode object defined in line 3
    *           internship: internship // the internship retrieved from db
    *                                  // only if the result code is resultCode.OK
    *       }
    */
    async retrieveInternship(id) {
        let internship = await Internship.findById(id);
           
        if(internship != null) {
            return {
                resultCode: resultCode.OK,
                internship: internship
            };
        }
        else {
            return {
                resultCode: resultCode.NOT_FOUND
            }; 
        }
    },
}