const jwt = require("jsonwebtoken")
const User = require("../models/User.js")
    ;


const auth = async (request, response, next) => {
    try {
        const { token } = request.cookies;
        if (token) {
            const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: verifyUser._id });

            request.token = token;
            request.user = user;
            next();
        }
        else {
            response.status(401).json({
                status: 401,
                message: "Please login to Access...",
            });
        }
    }
    catch (error) {
        response.status(401).json({
            status: 401,
            message: error.message,
        });
    }
}

module.exports = auth;