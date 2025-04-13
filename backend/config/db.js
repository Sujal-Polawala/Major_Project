// /config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://sujalpolawala:24nbYHl0uvOQGeRY@e-commerces.ozhgm.mongodb.net/e-commerces
`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);  // Exit process with failure
  }
};

module.exports = connectDB;
