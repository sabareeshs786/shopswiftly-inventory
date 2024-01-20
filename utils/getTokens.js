require('dotenv').config();
const jwt = require('jsonwebtoken');

const getAccessToken = (userid, roles) => {
    return jwt.sign(
        {
            "UserInfo": {
                "userid": userid,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2h' }
    );
}

module.exports = { getAccessToken };