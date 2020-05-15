let mongoose = require("mongoose");

module.exports.connect = function () {
    var url = "mongodb://localhost:27017/dba_db";
    return mongoose.createConnection(url, {
        useNewUrlParser: true,
        poolSize: 20
    });
};
