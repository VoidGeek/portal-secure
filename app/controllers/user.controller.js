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

