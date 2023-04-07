const mongoose = require("mongoose")

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.ObjectId, ref: "Category", required: true },
    location: { type: String, required: true },
    days: { type: Number, required: true },
    nights: { type: Number, required: true },
    orignalPrice: { type: Number, required: true },
    downPrice: { type: Number },
    image: { type: String },
    description: { type: String },
    ratings: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },
    services: [
        {
            type: { type: String, required: true },
            image: { type: String, required: true },
        }
    ],
    reviews: [
        {
            user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
            name: { type: String, required: true },
            image: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
        }
    ],
    createdAt: { type: Date, default: Date.now }
})


// Model
const Package = new mongoose.model("Package", packageSchema);
module.exports = Package;