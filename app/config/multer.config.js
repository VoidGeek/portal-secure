const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../uploads'); // Save uploaded files to the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for storage
  },
});

const upload = multer({ storage });

module.exports = upload;
