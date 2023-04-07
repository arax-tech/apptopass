const express = require("express")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const sendEmail = require("../include/sendEmail");



const router = express.Router()

// Middleware
const auth = require("../middleware/auth")

// Models 
const User = require("../models/User");
const Package = require("../models/Package");
const Category = require("../models/Category");
const Ads = require("../models/Ads");



router.post('/login', async (request, response) => {

    try {
        const { email, password } = request.body;
        const loginUser = await User.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, loginUser.password)
        if (isMatch) {

            if (loginUser.isVerified === "false") {
                response.status(500).json({
                    status: 500,
                    message: "Please verify your email first...",
                })
            } else {
                const token = await loginUser.generateAuthToken();

                response.cookie("token", token, {
                    expires: new Date(Date.now() + process.env.JWT_EXPIRE_TOKEN * 24 * 60 * 60 * 1000),
                    httpOnly: true
                });
                // console.log("cookies" + request.cookies.jwt);

                const authuser = await User.findById(loginUser._id).populate("referrals", "name email createAt").select('-password -tokens -resetPasswordOtp -isVerified');

                const packages = await Package.find().populate("category", "name");
                const categories = await Category.find();
                const ads = await Ads.find();

                response.status(200).json({
                    status: 200,
                    message: "Login Successfully...",
                    user: authuser,
                    token: token,
                    packages: packages,
                    ads: ads,
                    categories: categories,
                })
            }
        }
        else {
            response.status(500).json({
                status: 501,
                message: "Invalid Email OR Password..."
            })
        }



    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: "Invalid Email OR Password..."
        })
    }
})



router.post("/register", async (request, response) => {
    try {
        const check = await User.findOne({ email: request.body.email });

        if (check) {
            response.status(500).json({
                status: 500,
                message: "Email is already taken, Please use another email...",
            });
        } else {
            

            // Generate OTP
            const otp = Math.floor(1000 + Math.random() * 9000);
            request.body.otp = otp;
            await User.create(request.body);            

            const message = `Your account verification OTP  is 👇 \n\n${otp}\n\n\nIf you have not requested this email then, please ignore this email... \n\n\nRegard AppToPass`;
            // await sendEmail({
            //     email: request.body.email,
            //     subject: "AppToPass - OTP Verification",
            //     message
            // });

            response.status(201).json({
                status: 201,
                referral: request.body.referral,
                email: request.body.email,
                message: "Registration Successfully...",
            });
        }
    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})


router.post('/verify', async (request, response) => {

    try {

        
        const { otp, email } = request.body;
        const loginUser = await User.findOne({ otp: otp });


        if (loginUser) {

            const token = await loginUser.generateAuthToken();

            response.cookie("token", token, {
                expires: new Date(Date.now() + process.env.JWT_EXPIRE_TOKEN * 24 * 60 * 60 * 1000),
                httpOnly: true
            });

            const authuser = await User.findById(loginUser._id).select('-createAt -password -tokens -resetPasswordOtp -isVerified');

            authuser.isVerified = true;
            await authuser.save();


            if (request.body.referral) {

                const refUser = await User.findById(request.body.referral);
                
                await User.findByIdAndUpdate(request.body.referral, {
                    $push: { referrals: authuser._id },
                });

                await User.findByIdAndUpdate(request.body.referral, {
                    $set: {
                        rewardPoints: refUser.rewardPoints > 0 ? refUser.rewardPoints + 500 : 500,
                    }
                })
            }

            const packages = await Package.find().populate("category", "name");
            const categories = await Category.find();
            const ads = await Ads.find();

            response.status(200).json({
                status: 202,
                message: "Login Successfully...",
                user: authuser,
                token: token,
                ads: ads,
                packages: packages,
                categories: categories,
            })
        }
        else {
            response.status(401).json({
                status: 401,
                email: email,
                message: "Invalid OTP..."
            })
        }

    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        })
    }
})

router.get("/logout", auth, async (request, response) => {
    try {
        // Logout form current device
        request.user.tokens = request.user.tokens.filter((currentElement) => {
            return currentElement.token === request.token
        });

        // Logout from all devices
        // request.user.tokens = [];


        response.clearCookie("token");
        // console.log("Logout Successfuly");
        const user = await request.user.save();
        response.status(200).json({
            status: 203,
            message: "Logout Successfully..."
        });
    }
    catch (error) {
        response.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
})



router.post("/password/forgot", async (request, response) => {

    try {
        const user = await User.findOne({ email: request.body.email });

        if (!user) {
            response.status(500).json({
                status: 500,
                message: "User not found with this email..."
            })
        } else {

            // Generate OTP
            const otp = Math.floor(1000 + Math.random() * 9000);
            user.resetPasswordOtp = otp;
            await user.save({ validateBeforeSave: false });


            const message = `Your password reset OTP  is 👇 \n\n${otp}\n\n\nIf you have not requested this email then, please ignore this email... \n\n\nRegard AppToPass`;

            await sendEmail({
                email: user.email,
                subject: "AppToPass - Password Reset",
                message
            })

            response.status(200).json({
                status: 200,
                message: `Password reset email send to ${user.email} Successfully...`
            })
        }
    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        })
    }
})

router.put("/password/reset/:otp", async (request, response) => {

    try {

        const user = await User.findOne({ resetPasswordOtp: request.params.otp });

        if (!user) {
            response.status(500).json({
                status: 500,
                message: "Reset Password Token is Invalid OR Expired..."
            })
        } else {
            user.password = request.body.password;
            user.resetPasswordOtp = "";
            await user.save();

            response.status(200).json({
                status: 202,
                message: `Password Reset Successfully...`
            })
        }

    }
    catch (error) {
        response.status(500).json({
            status: 500,
            message: error.message
        })
    }
})


module.exports = router;