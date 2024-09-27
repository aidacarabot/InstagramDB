const Post = require('../models/post');
const { deleteImgCloudinary } = require('../../utils/deleteFile');
const cloudinary = require('cloudinary').v2;

//! Create a new post
const createPost = async (req, res, next) => {
    try {
        // Subir la imagen a Cloudinary dentro de la carpeta "Instagram_Project/instagramPosts"
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'Instagram_Project/instagramPosts', // Carpeta y subcarpeta en Cloudinary
        });

        // Crear el nuevo post con la URL de Cloudinary
        const newPost = new Post({
            caption: req.body.caption, // Captura el texto del post desde el cuerpo de la solicitud
            imageUrl: uploadResult.secure_url, // Usa la URL segura de Cloudinary obtenida tras subir la imagen
            account: req.body.account // Captura la cuenta asociada desde el cuerpo de la solicitud
        });

        // Guardar el post en la base de datos
        await newPost.save();


        // Realizar el populate de la cuenta asociada                               lo que quieres que salga
        const populatedPost = await Post.findById(newPost._id).populate('account', 'username profilePicture');

        // Devolver el post con la cuenta populada
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//!Get all posts
const getAllPosts = async (req, res, next) => {
    try {
        // Encuentra todos los posts en la base de datos y realiza el populate del campo "account" para incluir el "username"
        const posts = await Post.find().populate('account', 'username');
        
        // Devuelve todos los posts con el campo "account" populado con el "username"
        res.status(200).json(posts);
    } catch (error) {
        // Maneja cualquier error que ocurra durante la consulta o el populate
        res.status(400).json({ error: error.message });
    }
};

//! Get a post by ID
const getPost = async (req, res, next) => {
    try {
        // Busca el post por ID y realiza el populate del campo "account" para incluir solo el "username"
        const post = await Post.findById(req.params.id)
            .populate('account', 'username'); // Populate username from Account
        
        // Si el post no existe, devuelve un 404 (Not Found)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Si el post existe, devuelve un 200 (OK) con el post populado
        res.status(200).json(post);
    } catch (error) {
        // Si ocurre un error, devuelve un 400 (Bad Request) con el mensaje de error
        res.status(400).json({ error: error.message });
    }
};

//! Update a post by ID
const updatePost = async (req, res, next) => {
    try {
        // Busca el post por ID
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' }); // Devuelve 404 si el post no existe
        }

        // Si se sube una nueva imagen, eliminar la antigua de Cloudinary
        if (req.file && post.imageUrl) {
            await deleteImgCloudinary(post.imageUrl); // Espera a que la imagen anterior sea eliminada de Cloudinary
        }

        // Si se sube una nueva imagen, subirla a Cloudinary y actualizar imageUrl
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'Instagram_Project/instagramPosts' // Asegúrate de usar la carpeta correcta
            });
            post.imageUrl = result.secure_url; // Actualiza la URL de la imagen en el post
        }

        // Actualiza la caption si se proporciona, o deja la existente si no
        post.caption = req.body.caption || post.caption;

        // Guarda los cambios en el post
        await post.save();

        // Realizar el populate de la cuenta asociada
        const populatedPost = await Post.findById(post._id).populate('account', 'username');

        // Devuelve el post actualizado con la cuenta populada
        res.status(200).json(populatedPost);
    } catch (error) {
        // Manejo de errores
        res.status(400).json({ message: error.message });
    }
};

//! Delete a post by ID
const deletePost = async (req, res, next) => {
    try {
        // Buscar el post por ID y realizar populate para incluir username y profilePicture del usuario asociado
        const post = await Post.findById(req.params.id).populate('account', 'username profilePicture');
        
        // Si no se encuentra el post, devolver un 404 (Not Found)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Si el post tiene una imagen asociada, eliminarla de Cloudinary
        if (post.imageUrl) {
            await deleteImgCloudinary(post.imageUrl); // Asegúrate de esperar a que se elimine la imagen
        }

        // Eliminar el post de la base de datos
        await Post.findByIdAndDelete(req.params.id);

        // Devolver una respuesta indicando que el post y la imagen asociada se eliminaron correctamente
        res.status(200).json({ message: 'Post and associated image deleted successfully', post });
    } catch (error) {
        // Manejar cualquier error y devolver un mensaje de error
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createPost, getPost, updatePost, deletePost, getAllPosts };
