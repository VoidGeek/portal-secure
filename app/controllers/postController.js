// controllers/postController.js
const Post = require('../models/postModel');

// Create a new post

exports.createPost = async (req, res) => {
  try {
    const { images, caption,} = req.body;

    // Ensure that req.user is defined and contains the user's ID
    if (!req.userId) {
      return res.status(401).json({ message: "User is not authenticated." });
    }

    // Validate that all required fields are provided
    if (!images || !caption ) {
      return res.status(400).json({ message: "All fields are required for post creation." });
    }

    const adminUserId = req.userId; // Use req.user.id to get the user's ID

    const post = new Post({
      images,
      caption,
      adminUser: adminUserId,
    });

    await post.save();

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find({}).exec();
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching posts' });
    }
  };

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    // Fetch the post by its ID (You should replace 'Post' with your actual MongoDB model)
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete the associated image from the Wasabi bucket
    const imageUrl = post.imageUrl; // Replace with the actual field name used to store the image URL in MongoDB
    const params = {
      Bucket: 'imagestore345', // Replace with your Wasabi bucket name
      Key: imageUrl, // Assuming imageUrl contains the key of the image in your Wasabi bucket
    };

    try {
      await s3Client.send(new DeleteObjectCommand(params));
    } catch (error) {
      console.error('Error deleting object:', error);
      return res.status(500).json({ message: 'Error deleting the image' });
    }

    // Now you can delete the post in your database
    await post.remove();

    res.status(200).json({ message: 'Post and associated image deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndRemove(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};