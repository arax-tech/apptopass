const jwt = require("jsonwebtoken")
const User = require("../models/User")

const admin = async (request, response, next) => {
    try {
        const { token } = request.cookies;

        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: verifyUser._id });

        if (user.role == "Admin") {
            next();
        }
        else {
            response.status(401).json({
                status: 401,
                message: "Only Admin can access this routes...",
            });
        }
    }
    catch (error) {
        response.status(401).json({
            status: 401,
            message: "Only Admin can access this routes...",
        });
    }
}

module.exports = admin;