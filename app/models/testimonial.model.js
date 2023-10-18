const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  testimonial_text: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  occupation: {
    type: String,
    required: true,
  },
  company: {
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
});

testimonialSchema.pre("findOneAndUpdate", function () {
  this._update.updatedAt = new Date();
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
