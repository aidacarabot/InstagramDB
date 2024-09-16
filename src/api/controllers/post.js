const Post = require('../models/post');
const Account = require('../models/account');
const { deleteImgCloudinary } = require('../../utils/deleteFile');
const cloudinary = require('cloudinary').v2;


// Create a new post
const createPost = async (req, res) => {
    try {
        // Crear el nuevo post
        const newPost = new Post({
            caption: req.body.caption,
            imageUrl: req.file.path, // Aquí usamos req.file.path para obtener la URL de la imagen
            account: req.body.account
        });

        // Guardar el post en la base de datos
        await newPost.save();

        // Realizar el populate de la cuenta asociada
        const populatedPost = await Post.findById(newPost._id).populate('account', 'username profilePicture');

        // Devolver el post con la cuenta populada
        res.status(201).json(populatedPost);
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

        // Si se sube una nueva imagen, eliminamos la antigua de Cloudinary
        if (req.file && post.imageUrl) {
            deleteImgCloudinary(post.imageUrl); // Eliminar la imagen anterior de Cloudinary
        }

        // Subir la nueva imagen a Cloudinary y actualizar solo el campo imageUrl
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'Instagram_Posts'
            });
            post.imageUrl = result.secure_url; // Guardar la nueva URL de la imagen
        }

        // Actualizar otros campos del post, asegurándose de no tocar profilePicture
        post.caption = req.body.caption || post.caption;

        await post.save();

        // Realizar el populate de la cuenta asociada
        const populatedPost = await Post.findById(post._id).populate('account', 'username');

        res.status(200).json(populatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a post
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('account', 'username profilePicture');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Eliminar la imagen del post en Cloudinary
        if (post.imageUrl) {
            deleteImgCloudinary(post.imageUrl);
        }

        // Eliminar el post de la base de datos
        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Post and associated image deleted successfully', post });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = { createPost, getPost, updatePost, deletePost, getAllPosts };
