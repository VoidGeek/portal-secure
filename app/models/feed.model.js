const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
  },
  feed_img: {
    type: String, // Store the URL/path to the image in S3
  },
  adminUser: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

feedSchema.pre("findOneAndUpdate", function () {
  this._update.updatedAt = new Date();
});

module.exports = mongoose.model("Feed", feedSchema);
