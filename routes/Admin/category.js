const express = require("express")

const router = express.Router();

// Model
const Category = require("../../models/Category")

// Middleware
const auth = require("../../middleware/auth")
const admin = require("../../middleware/admin")



router.get("/", auth, admin, async (request, response) => {
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


router.get("/:id", auth, admin, async (request, response) => {
    try {
        const _id = request.params.id;
        const category = await Category.findById(_id);
        response.status(200).json({
            status: 200,
            category: category
        });
    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})


router.post("/store", auth, admin, async (request, response) => {
    try {
        const createCategory = new Category(request.body);
        const result = await createCategory.save();
        response.status(201).json({
            status: 201,
            message: "Category Created Successfully..."
        });

    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})

router.patch("/update/:id", auth, admin, async (request, response) => {
    try {



        const _id = request.params.id;
        await Category.findByIdAndUpdate(_id, request.body, { new: true });
        response.status(200).json({
            status: 200,
            message: "Category Updated Successfully...",
        });

    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})


router.delete("/delete/:id", auth, admin, async (request, response) => {
    try {
        const _id = request.params.id;
        await Category.findByIdAndDelete(_id);
        response.status(200).json({
            status: 200,
            message: "Category Deleted Successfully..."
        });

    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})




module.exports = router;