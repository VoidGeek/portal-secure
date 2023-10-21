// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  images: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  adminUser: {
    type: String, // Store the admin's username as a string
    required: true, // Make it a required field
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
});


postSchema.pre("findOneAndUpdate", function () {
  this._update.updatedAt = new Date();
});

module.exports = mongoose.model('Post', postSchema);