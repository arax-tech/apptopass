const express = require("express")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const sendEmail = require("../include/sendEmail");



const router = express.Router()

// Middleware
const auth = require("../middleware/auth")

// Models 
const Package = require("../models/Package");



router.get("/package", auth, async (request, response) => {
    try {
        const packages = await Package.find().populate("reviews.user", "name image").populate("category", "name");
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


router.get("/package/:id", auth, async (request, response) => {
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