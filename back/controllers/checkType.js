const { Mongoose } = require("mongoose");

const mongoose = require('mongoose');

module.exports = {
    checkISODate: function(dateString) {
        let date = new Date(dateString);
        
        if(date.toString() === "Invalid Date"){
            return false;
        }
        
        if(date.toISOString() !== dateString) {
            return false;
        }
        return true;
    },

    handleDateCheck: function(req, res, datesFields) { 
        for(const [key, value] of Object.entries(req.body)) {
            if(datesFields.includes(key)) {
                if( ! this.checkISODate(value)) {
                    res.status(400)
                        .json({
                            success: false,
                            message: "Date fields needs to be in ISO format."
                        });

                    return false;
                }
            }
        }

        return true;
    },

    isInteger: function(value) {
        return !isNaN(value) && 
            parseInt(Number(value)) == value && 
            !isNaN(parseInt(value, 10));
    },

    isMongoId: function(value) {
        try {
            const valueObjectId = new mongoose.Types.ObjectId(value);
            return valueObjectId instanceof mongoose.Types.ObjectId;

        } catch (error) {
            return false;
        }
    },

    handleIdCheck: function(res, id) {
        if(! this.isMongoId(id)) {
            res.status(400)
                .json({
                    success: false,
                    message: 'Unvalid id.'
                });

            return false;    
        }

        return true;
    }
}