const mongoose = require('mongoose')

const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID.')

    next()
}

module.exports = validateObjectId