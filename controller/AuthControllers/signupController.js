const bcrypt = require('bcrypt');

const User = require('../../models/User');
const { isPasswordValid } = require('../../utils/checkInputValidity');
const { res400 } = require('../../utils/errorResponse');

const handleNewUser = async (req, res) => {
    try {
        const { email, pwd, cpwd } = req.body;
        if (!email || !pwd || !cpwd) return res.status(400).json({ 'message': 'Email id and password are required.' });

        const duplicate = await User.findOne({ email: email }).exec();
        if (duplicate) return res.status(409).json({ "message": "The entered Email id is already present" });

        const passwordValidity = isPasswordValid(pwd);
        const cpasswordValidity = isPasswordValid(cpwd);
        if (!passwordValidity || !cpasswordValidity) return res400(res, "Invalid password entered");
        if (pwd != cpwd) return res400(res, "Passwords doesn't match");

        const hashedPwd = await bcrypt.hash(pwd, 10);
        const result = await User.create({
            "email": email,
            "password": hashedPwd
        });
        //TODO - Include access and refresh tokens and send it in the response

        await result.save();
        res.status(201).json({ 'success': `New user with email id ${email} is created!` });
    } catch (err) {
        res.status(500).json({ 'message': "Internal server error occurred!!!\n Try again later" });
    }
}

module.exports = { handleNewUser };