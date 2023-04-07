// Database Connection
const mongoose = require('mongoose')

// Table Schema/Migration
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    createAt: { type: Date, default: Date.now }

})


// Model
const Category = new mongoose.model("Category", categorySchema);
module.exports = Category;