module.exports = {
    test: (req, res, next) => {
        res.status(200)
            .json({
                success: true,
            });

        next();
    },

    
}