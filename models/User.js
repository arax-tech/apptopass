const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

// Table Schema/Migration
const userSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String },
    phone: { type: String },
    otp: { type: String },
    isVerified: { type: String, default: false },
    rewardPoints: { type: Number, default: 0 },
    reward_points: { type: String },
    cache_balance: { type: String },
    referrals: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    status: { type: String, default: "Active" },
    image: { type: String },
    owner_name: { type: String },
    edition: { type: String },
    card_number: { type: String },
    valid_upto: { type: String },
    role: { type: String, default: "User", },
    resetPasswordOtp: String,
    tokens: [{ token: { type: String, required: true } }],
    createAt: { type: Date, default: Date.now }
})



// Password Hasing
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

// Generating Auth Token

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    }
    catch (error) {
        console.log(error);
    }
}

// Generate Reset Password Token 
userSchema.methods.getResetPasswordToken = function () {

    // Generating Token 
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing & Adding to ResetPasswordToken in userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Expire Token after 10 Minutes
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //Minutes 10 / Second 60 / Milisecond 1000

    return resetToken;

}

// Model
const User = new mongoose.model("User0", userSchema);
module.exports = User;