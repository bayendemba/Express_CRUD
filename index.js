require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/error");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require("mongoose");
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const app = express();

winston.handleExceptions(new winston.transports.File({
    filename: "uncaughtExceptions.log"
}));

process.on("unhandledRejection", (ex) => {
    throw ex;
});

// winston 
winston.add(winston.transports.File, {
    filename: "logfile.log"
});
winston.add(winston.transports.MongoDB, {
    db: "mongodb://localhost/vidly",
    level: "info"
});

const p = Promise.reject(new Error("Something failed miserably!"));
p.then(() => console.log("Done"));





// jwtPrivateKey Config
if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}

// Connect to mongoDB
mongoose.connect("mongodb://localhost/vidly", {
        useNewUrlParser: true
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

// Erreur middleware
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serveur démarrer sur le port ${port}...`));