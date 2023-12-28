require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const getRefreshToken = (email) => {
    const refreshToken = jwt.sign(
        { "email": email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
    return refreshToken;
};

const getAccessToken = (email, roles) => {
    return jwt.sign(
        {
            "UserInfo": {
                "email": email,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2h' }
    );
}

module.exports = {getRefreshToken, getAccessToken};