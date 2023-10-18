const Testimonial = require("../models/testimonial.model");

const testimonialPermission = async (req, res, next) => {
  const testimonialId = req.params.id; // Assuming testimonial ID is in the request parameters

  try {
    const testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Check if the requesting user is the admin of the testimonial
    if (testimonial.adminUser.toString() !== req.username) {
      return res.status(403).json({ message: "You are not authorized to perform this operation" });
    }

    // If the user is the admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking admin permission for testimonial:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = testimonialPermission;
