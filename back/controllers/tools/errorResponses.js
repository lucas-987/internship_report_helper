module.exports = {
    notFound(res) {
        res.status(404)
            .json({
                success: false,
                message: 'Not found'
            });
    },

    internalError(res) {
        res.status(500)
            .json({
                success: false,
                message: 'Internal server error'
            });
    }
}