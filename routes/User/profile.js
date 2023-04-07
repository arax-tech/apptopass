const express = require("express")
const multer = require("multer")
const fs = require("fs")
const path = require("path")

const router = express.Router()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/user')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, "user" + '-' + Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })
// Middlewares
const auth = require("../../middleware/auth")
const user = require("../../middleware/user")


// Model 
const User = require("../../models/User")
const Package = require("../../models/Package")
const Category = require("../../models/Category")
const Ads = require("../../models/Ads")



router.get("/profile", auth, user, async (request, response) => {
    try {
        const _id = request.user.id;
        const user = await User.findById(_id).populate("referrals", "name email createAt").select('-password -tokens -resetPasswordOtp -isVerified');
        const packages = await Package.find().populate("category", "name");
        const categories = await Category.find();
        const ads = await Ads.find();
        response.status(200).json({
            status: 200,
            user: user,
            ads: ads,
            packages: packages,
            categories: categories,
        });
    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})


router.patch("/profile", auth, user, upload.single('image'), async (request, response) => {

    try {
        const _id = request.user.id;
        const user = await User.findById(_id);
        if (request.file) {
            if (user.image && user.image.length > 0) {
                const oldImage = `images${user.image.split("/images")[1]}`
                fs.unlinkSync(path.join(__dirname, "../../public/" + oldImage))
            }
            request.body.image = `${request.protocol}://${request.get('host')}/images/user/${request.file.filename}`;
        } else {
            request.body.image = user.image

        }
        await User.findByIdAndUpdate(_id, request.body, { new: true });
        response.status(200).json({
            status: 200,
            message: "Profile Updated Successfully..."
        });
    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }

});

router.patch("/update/card", auth, user, async (request, response) => {

    try {
        const _id = request.user.id;
        await User.findByIdAndUpdate(_id, request.body, { new: true });
        response.status(200).json({
            status: 200,
            message: "Card Updated Successfully..."
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
