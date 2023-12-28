const User = require('../models/User');

const verifyRefreshToken = async (req, res, next) => {
    try {
        const email = req.email;
        const roles = req.roles;
        const foundUser = await User.findOne({ email: email }).exec();
        if (!foundUser || !foundUser.refreshToken) return res.sendStatus(401);
        next();
    } catch (error) {

    }

}

module.exports = verifyRefreshToken;