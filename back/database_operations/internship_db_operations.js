const Internship = require('../model/Reportable');

module.exports = {
    async retireveInternship(id, res, next) {
        let internship = await Internship.findById(id);
            
        if(internship == null) {
            res.status(404)
                .json({
                    success: false,
                    message: 'Internship not found.'
                    });

            next();
            return;    
        }
        
        return internship;
    },


}