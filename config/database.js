const mongoose = require("mongoose");

const readConnection = mongoose.createConnection(
    process.env.MONGO_READ_URI
);

const writeConnection = mongoose.createConnection(
    process.env.MONGO_WRITE_URI
);

readConnection.on("connected", () => {
    console.log("READ database connected");
});

writeConnection.on("connected", () => {
    console.log("WRITE database connected");
});

module.exports = {
    readConnection,
    writeConnection
};