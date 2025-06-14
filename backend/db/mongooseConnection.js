const mongoose = require('mongoose');
const debug = require("debug")("app:db");
const config = require("dotenv").config();
mongoose.connect(config.parsed.db)
.then(() => {
  debug("Connected to MongoDB");
})
.catch((err) => {
  debug("Error connecting to MongoDB:", err);
}); 