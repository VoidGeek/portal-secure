const AWS = require('aws-sdk');
const Feed = require('../models/feed.model');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

exports.createFeedItem = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: 'User is not authenticated.' });
    }

    if (!caption) {
      return res.status(400).json({ message: 'A caption is required for a feed item.' });
    }

    // Assuming Multer has stored the image buffer in 'req.file.buffer'
    const imageBuffer = req.file.buffer;

    const adminUserId = req.userId; // Use req.userId to get the user's ID

    // Specify the S3 bucket name and the desired key (file name) for the image
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${adminUserId}/${Date.now()}_${req.file.originalname}`, // Customize the key as needed
      Body: imageBuffer,
      ACL: 'public-read', // Set the appropriate ACL for your use case
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        console.error('Error uploading image to S3:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const feedItem = new Feed({
        caption,
        adminUser: adminUserId,
        feed_img: data.Location, // Store the S3 URL in MongoDB
      });

      await feedItem.save();

      res.status(201).json({ message: 'Feed item created successfully' });
    });
  } catch (error) {
    console.error('Error creating feed item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllFeedItems = async (req, res) => {
  try {
    const feedItems = await Feed.find();
    res.status(200).json(feedItems);
  } catch (error) {
    console.error('Error fetching feed items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFeedItemById = async (req, res) => {
  try {
    const feedItem = await Feed.findById(req.params.id);
    if (!feedItem) {
      return res.status(404).json({ message: 'Feed item not found' });
    }
    res.status(200).json(feedItem);
  } catch (error) {
    console.error('Error fetching feed item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateFeedItem = async (req, res) => {
  try {
    const feedItem = await Feed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feedItem) {
      return res.status(404).json({ message: 'Feed item not found' });
    }
    res.status(200).json({ message: 'Feed item updated successfully' });
  } catch (error) {
    console.error('Error updating feed item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteFeedItem = async (req, res) => {
  try {
    const feedItem = await Feed.findByIdAndRemove(req.params.id);
    if (!feedItem) {
      return res.status(404).json({ message: 'Feed item not found' });
    }
    res.status(200).json({ message: 'Feed item deleted successfully' });
  } catch (error) {
    console.error('Error deleting feed item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
