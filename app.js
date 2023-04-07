require("dotenv").config();

const express = require("express")
const cors = require("cors")
const cookie = require("cookie-parser")
const bodyParser = require("body-parser")
const morgan = require("morgan")


const app = express();
const PORT = process.env.PORT || 8000;


// Middlewares
app.use(express.json({ limit: '100mb' }));
app.use(cors());
app.use(cookie());
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(morgan("dev"));

app.use(express.static("public"));




// Database 
require("./database/config")


// Model
const auth = require("./middleware/auth");




app.get('/', async (request, response) => {
    
    response.status(500).json({
        message: "Welcome..."
    })
   
})



// Auth Routes
app.use("/api/auth", require("./routes/auth"))

app.use("/api/app", require("./routes/app"))

// Admin
app.use("/api/admin", require("./routes/Admin/profile"));
app.use("/api/admin/password", require("./routes/Admin/password"))
app.use("/api/admin/category", require("./routes/Admin/category"))
app.use("/api/admin/package", require("./routes/Admin/package"))
app.use("/api/admin/ads", require("./routes/Admin/ads"))


// User
app.use("/api/user", require("./routes/User/profile"));
app.use("/api/user/password", require("./routes/User/password"))
app.use("/api/user/reward", require("./routes/User/reward"))
app.use("/api/user/review", require("./routes/User/review"))



// Server Listing At 
app.listen(PORT, () => {
    // console.log(`Server is Running at http://localhost:8000/`);
});





