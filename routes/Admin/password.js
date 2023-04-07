const express = require("express")
const bcrypt = require("bcryptjs")

const router = express.Router();

// Middleware
const auth = require("../../middleware/auth")
const admin = require("../../middleware/admin")

// Model
const User = require("../../models/User")


router.patch("/update", auth, admin, async (request, response) => {
    try {

        const password = request.body.current_password
        const user = await User.findOne({ _id: request.user.id });

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            user.password = request.body.new_password;
            await user.save();
            response.status(200).json({
                status: 200,
                message: "Password Updated Successfully..."
            });
        }
        else {
            response.status(500).json({
                status: 500,
                message: "Current Password is Incorrect..."
            });
        }

    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})




module.exports = router;