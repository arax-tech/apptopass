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
const user = require("../../middleware/user")

// Model
const Category = require("../../models/Category")
const Package = require("../../models/Package")


router.get("/package", auth, user, async (request, response) => {
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


router.get("/category", auth, user, async (request, response) => {
    try {
        const categories = await Category.find();
        response.status(200).json({
            status: 200,
            categories: categories
        });
    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})

router.get("/package/:id", auth, user, async (request, response) => {
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








module.exports = router;