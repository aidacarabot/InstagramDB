const Post = require('../models/post');
const Account = require('../models/account');
const cloudinary = require('cloudinary').v2;

// Create a new post
const createPost = async (req, res, next) => {
    try {
      const newPost = new Post({
        caption: req.body.caption,
        imageUrl: req.file.path, // Cloudinary stores the image URL in `req.file.path`
        account: req.body.account,
      });
        await newPost.save();

        // Optionally, update the account's posts array (if tracked)
        await Account.findByIdAndUpdate(req.body.account, {
            $inc: { posts: 1 }
        });

        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Get all posts
const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('account', 'username'); // Popular el campo username desde Account
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a post by ID
const getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('account', 'username'); // Populate username from Account
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a post
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    // If a new image is uploaded, delete the old image from Cloudinary
    if (req.file) {
        const publicId = post.imageUrl.split('/').pop().split('.')[0]; // Extract the publicId from the URL
        await cloudinary.uploader.destroy(publicId); // Delete the old image

        // Update the post with the new image URL
        post.imageUrl = req.file.path;
    }

    // Update other fields
    post.caption = req.body.caption || post.caption;
    await post.save();

    res.status(200).json(post);
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

// Delete a post
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    // Delete the image from Cloudinary
    const publicId = post.imageUrl.split('/').pop().split('.')[0]; // Extract the publicId from the URL
    await cloudinary.uploader.destroy(publicId); // Delete the image

    await post.remove();

    // Optionally, update the account's posts array (if tracked)
    await Account.findByIdAndUpdate(post.account, {
        $inc: { posts: -1 }
    });

    res.status(200).json({ message: 'Post and associated image deleted successfully' });
} catch (error) {
    res.status(400).json({ error: error.message });
}
};


module.exports = { createPost, getPost, updatePost, deletePost, getAllPosts };
