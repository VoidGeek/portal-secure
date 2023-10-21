const ImageModel = require('../models/image.model');
const multer = require('multer');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();


const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.createImage = async (req, res) => {
    const { originalname, buffer } = req.file;
    const key = `${uuidv4()}-${originalname}`; // Generate a unique key
  
    const params = {
      Bucket: 'finaldemo34',
      Key: key,
      Body: buffer,
    };
  
    try {
      await s3.upload(params).promise();
      const imageUrl = s3.getSignedUrl('getObject', { Bucket: params.Bucket, Key: params.Key });
  
      const newImage = new ImageModel({
        name: originalname,
        imageUrl,
        s3Key: key, // Save the S3 key in your MongoDB for reference
      });
  
      await newImage.save();
  
      res.status(201).json({ message: 'Image uploaded successfully', imageUrl, s3Key: key });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload image' });
    }
  };
  
  // Image delete route
  exports.deleteImage = async (req, res) => {
    const s3Key = req.params.s3Key;
  
    if (!s3Key) {
      return res.status(400).json({ message: 'S3 key is missing' });
    }
  
    try {
      // Delete the object from S3
      await s3.deleteObject({ Bucket: 'finaldemo34', Key: s3Key }).promise();
  
      // Find and delete the image by the s3Key in MongoDB
      const deletedImage = await ImageModel.findOneAndDelete({ s3Key });
  
      if (!deletedImage) {
        return res.status(404).json({ message: 'Image not found in the database' });
      }
  
      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete image' });
    }
  };
  
  // Image update route
  exports.updatedImage = async (req, res) => {
    const s3Key = req.params.s3Key;
  
    if (!s3Key) {
      return res.status(400).json({ message: 'S3 key is required' });
    }
  
    const { originalname, buffer } = req.file;
    const newKey = `${uuidv4()}-${originalname}`;
  
    try {
      // Delete the old object from S3
      await s3.deleteObject({ Bucket: 'finaldemo34', Key: s3Key }).promise();
  
      // Upload the new object to S3
      const newParams = {
        Bucket: 'finaldemo34',
        Key: newKey,
        Body: buffer,
      };
      await s3.upload(newParams).promise();
  
      // Update the MongoDB record with the new S3 key and URL
      const updatedImage = await ImageModel.findOneAndUpdate(
        { s3Key },
        { $set: { s3Key: newKey, imageUrl: s3.getSignedUrl('getObject', { Bucket: 'finaldemo34', Key: newParams.Key }) } },
        { new: true }
      );
  
      if (!updatedImage) {
        return res.status(404).json({ message: 'Image not found in the database' });
      }
  
      res.json({ message: 'Image updated successfully', imageUrl: updatedImage.imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update image' });
    }
  };
  
  // Get all images route
  exports.getImage = async (req, res) => {
    try {
      const images = await ImageModel.find();
      res.json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch images' });
    }
  };
  
  // Get an image by ID route
  exports.getImageById = async (req, res) => {
    const imageId = req.params.id;
  
    try {
      const image = await ImageModel.findById(imageId);
  
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      res.json(image);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch the image' });
    }
  };