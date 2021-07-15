const checkBody = (req, res, allowedKeys, requiredKeys) => {
    if(! handleEmptyBody(req, res)) {
        return false;
    }

    if(! handleRequiredKeys(req, res, requiredKeys)) {
        return false;
    }

    if(! handleAllowedKeys(req, res, allowedKeys)) {
        return false;
    }

    return true;
};

const handleEmptyBody = (req, res) => {
    if( Object.keys(req.body).length === 0 && req.body.constructor === Object) { 
        res.status(400)
            .json({
                success: false,
                message: "Request body missing."
            });
        return false;
    }

    return true;
};

const handleRequiredKeys = (req, res, requiredKeys) => {
    for (const key of requiredKeys) {
        if(! req.body.hasOwnProperty(key)) {
            res.status(400)
                .json({
                    success: false,
                    message: "Some request parameters are missing."
                });
            
            return false;
        }
    }

    return true;
};

const handleAllowedKeys = (req, res, allowedKeys) => {
    for(const requestKey of Object.keys(req.body)) {
        if(! allowedKeys.includes(requestKey)) {
            res.status(400)
                .json({
                    success: false,
                    message: "Unvalid properties"
                });

            return false;
        }
    }

    return true;
};

module.exports = checkBody;