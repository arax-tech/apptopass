const mongoose = require('mongoose');

mongoose.connect(`mongodb://admin:admin@cluster0-shard-00-00.oe8tl.mongodb.net:27017,cluster0-shard-00-01.oe8tl.mongodb.net:27017,cluster0-shard-00-02.oe8tl.mongodb.net:27017/apptopass?ssl=true&replicaSet=atlas-hcn7w3-shard-0&authSource=admin&retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log("Connected : " + result.connection.db.namespace);
}).catch((error) => {
    console.log(error);
});