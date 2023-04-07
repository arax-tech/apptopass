const express = require("express")

const router = express.Router()


// Middlewares
const auth = require("../../middleware/auth")
const user = require("../../middleware/user")


// Model 
const User = require("../../models/User")




router.get("/:point", auth, user, async (request, response) => {

    try {

        const _id = request.user.id;
        const user = await User.findById(_id);

        const p = await User.findByIdAndUpdate(_id, {
            $set: {
                rewardPoints: Number(user.rewardPoints) + Number(request.params.point),
            }
        }, {
            new: true,
            useFindAndModify: false
        });

        response.status(200).json({
            status: 200,
            message: `You earned ${request.params.point} Reward Points...`,
            points: p?.rewardPoints
        });
    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }

});


module.exports = router;
