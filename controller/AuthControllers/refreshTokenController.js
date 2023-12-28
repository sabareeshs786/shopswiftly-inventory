const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { getAccessToken } = require('../../utils/getTokens');

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.status(401).json({ "message": "You are not authorized\nTry logging in again" });
        const refreshToken = cookies.jwt;

        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) return res.status(403).json({ "message": "You are not authorized\nTry logging in again" });

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.email !== decoded.email)
                    return res.status(403).json({ "message": "You are not authorized\nTry logging in again" });
                const roles = Object.values(foundUser.roles);
                const accessToken = getAccessToken(decoded.email, roles);
                res.json({ roles, accessToken });
            }
        );
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }

}

module.exports = { handleRefreshToken };