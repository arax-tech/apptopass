// Database Connection
const mongoose = require('mongoose')

// Table Schema/Migration
const adsSchema = new mongoose.Schema({
    title: { type: String, required: true},
    image: { type: String, required: true},
    createAt: { type: Date, default: Date.now }

})


// Model
const Ads = new mongoose.model("Ads", adsSchema);
module.exports = Ads;