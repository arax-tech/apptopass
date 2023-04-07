const express = require("express")

const multer = require("multer")
const fs = require("fs")
const path = require("path")

const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/package')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];

        cb(null, "package" + '-' + Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })


// Middleware
const auth = require("../../middleware/auth")
const admin = require("../../middleware/admin")

// Model
const User = require("../../models/User")
const Package = require("../../models/Package")


router.get("/", auth, admin, async (request, response) => {
    try {
        const packages = await Package.find().populate("category", "name");
        response.status(200).json({
            status: 200,
            packages: packages
        });
    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})


router.get("/:id", auth, admin, async (request, response) => {
    try {
        const _id = request.params.id;
        const package = await Package.findById(_id).populate("reviews.user", "name image").populate("category", "name");
        response.status(200).json({
            status: 200,
            package: package
        })
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
            request.body.image = `${request.protocol}://${request.get('host')}/images/package/${request.file.filename}`;
        } else {
            request.body.image = null
        }
        const create = new Package(request.body);
        await create.save();
        response.status(200).json({
            status: 200,
            message: "Package Create Successfully..."
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