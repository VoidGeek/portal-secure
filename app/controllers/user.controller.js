const User = require("../models/user.model");
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

// exports.userBoard = (req, res) => {
//   res.status(200).send("User Content.");
// };

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.getAllUsers = (req, res) => {
  // Implement the logic to retrieve all user accounts from your database or user data source.
  // This may involve querying your database and retrieving all user records.

  // For example, if you're using Mongoose with MongoDB:
  User.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    res.status(200).json(users);
  });
};


// Delete user by ID
exports.deleteUser = (req, res) => {
  const userId = req.params.id; // Assuming the user's ID is passed as a route parameter

  User.findByIdAndRemove(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).json(); // Return a success response with no content
  });
};



// Update user by ID
exports.updateUser = (req, res) => {
  const userId = req.params.id; // Assuming the user's ID is passed as a route parameter
  const updatedData = req.body; // Data to update

  User.findByIdAndUpdate(userId, updatedData, { new: true }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Return the updated user
  });
};

