const typeChecker = require('./checkType.js');

module.exports = {
    handleInternalServerError: (error, res) => {
        res.status(500)
                .json({
                    success: 'false',
                    message: error.toString()
                });
    },

    handleIdTypeCheck: (req, res) => {
        if(typeChecker.isInteger(req.params.id)) {
            return true;
        }

        res.status(400)
            .json({
                success: false,
                message: "Id is not an integer."
            });
        
        return false;
    }
}