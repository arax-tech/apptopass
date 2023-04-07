const express = require("express")

const multer = require("multer")
const fs = require("fs")
const path = require("path")

const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/ads')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];

        cb(null, "ads" + '-' + Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })


// Middleware
const auth = require("../../middleware/auth")
const admin = require("../../middleware/admin")

// Model
const Ads = require("../../models/Ads")


router.get("/", auth, admin, async (request, response) => {
    try {
        const ads = await Ads.find();
        response.status(200).json({
            status: 200,
            ads: ads
        });
    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})






router.post("/store", auth, admin, upload.single('image'), async (request, response) => {

    try {
        if (request.file) {
            request.body.image = `${request.protocol}://${request.get('host')}/images/ads/${request.file.filename}`;
        } else {
            request.body.image = null
        }
        const create = new Ads(request.body);
        await create.save();
        response.status(200).json({
            status: 200,
            message: "Ads Create Successfully..."
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