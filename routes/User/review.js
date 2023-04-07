const express = require("express")

const router = express.Router();

// Middleware
const auth = require("../../middleware/auth")
const user = require("../../middleware/user")

// Model
const Package = require("../../models/Package")



router.post("/store", auth, user, async (request, response) => {

    try {

        let message = "";

        const { package_id, comment, rating } = request.body;
        const review = {
            user: request.user.id,
            name: request.user.name,
            image: request.user.image.url,
            rating: Number(rating),
            comment
        };
        const package = await Package.findById(package_id);
        const isReviewed = package.reviews.find((rev) => rev.user.toString() === request.user.id.toString());
        if (isReviewed) {
            package.reviews.forEach((revs) => {
                if (revs.user.toString() === request.user.id.toString()) {
                    revs.rating = rating,
                        revs.comment = comment
                }

            });
            message = "Review Updated Successfully..."
        }
        else {
            package.reviews.push(review);
            package.numberOfReviews = package.reviews.length

            message = "Review Created Successfully..."
        }

        let avg = 0;
        package.reviews.forEach(rev => {
            avg += rev.rating;
        })
        package.ratings = avg / package.reviews.length;

        await package.save({ validateBeforeSave: false })

        response.status(201).json({
            status: 201,
            message: message
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