const mongoose = require('mongoose');

mongoose.connect("mongodb://yollodbuser:YolloVerse2023@202.21.32.148:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log("Connected : " + result.connection.db.namespace);
}).catch((error) => {
    console.log(error);
});