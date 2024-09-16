const { deleteImgCloudinary } = require('../../utils/deleteFile');
const Account = require('../models/account');
const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;


// Create a new account
const createAccount = async (req, res, next) => {
    try {
        // Creación de la cuenta
        const newAccount = new Account({
            username: req.body.username,
            bio: req.body.bio,
            profilePicture: req.file ? req.file.path : '',
            followers: req.body.followers || 0,
            following: req.body.following || 0,
        });

        await newAccount.save();

        // Si estás creando un post asociado a la cuenta
        const newPost = new Post({
            caption: "Nuevo post de bienvenida",
            imageUrl: req.file ? req.file.path : '',
            account: newAccount._id
        });

        await newPost.save();

        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las cuentas
const getAllAccounts = async (req, res, next) => {
    try {
      const accounts = await Account.find();
      res.status(200).json(accounts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Get an account by ID
const getAccount = async (req, res, next) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an account
const updateAccount = async (req, res, next) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Eliminar la imagen antigua de Cloudinary si se sube una nueva
        if (req.file && account.profilePicture) {
            deleteImgCloudinary(account.profilePicture);
        }

        // Actualizar la imagen de perfil con la nueva URL
        if (req.file) {
            account.profilePicture = req.file.path;
        }

        await account.save();

        res.status(200).json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Delete an account
const deleteAccount = async (req, res, next) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Eliminar los posts asociados con esta cuenta
        const posts = await Post.find({ account: req.params.id });
        if (posts.length > 0) {
            await Post.deleteMany({ account: req.params.id });
        }

        // Eliminar la imagen de perfil de Cloudinary
        if (account.profilePicture) {
            deleteImgCloudinary(account.profilePicture);
        }

        // Eliminar la cuenta
        await Account.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Account and associated posts and image deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = { createAccount, getAccount, updateAccount, deleteAccount, getAllAccounts };