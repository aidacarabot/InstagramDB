const { deleteImgCloudinary } = require('../../utils/deleteFile');
const Account = require('../models/account');// Importas el modelo de la cuenta (Account) desde la carpeta models, que define cómo se almacenan las cuentas en la base de datos.
const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;//Importas el módulo cloudinary para manejar la subida de archivos a Cloudinary.


//! Create a new account
const createAccount = async (req, res, next) => {
    try {
        // Desestructurar los valores de req.body
        const { username, bio, followers = 0, following = 0 } = req.body;

        // Intento de reutilización del storage de Cloudinary cambiando la carpeta
        let profilePictureUrl = ''; // Se utiliza para almacenar la URL de la imagen de perfil que se subirá a Cloudinary
        if (req.file) { // Verifica si has subido un archivo de imagen
            // Especificar la subcarpeta dentro de "Instagram_Project"
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'Instagram_Project/profilePictures', // Guardar en "Instagram_Project/profilePictures"
            });
            profilePictureUrl = uploadResult.secure_url; // Almacena la URL segura de la imagen subida para su posterior uso en la base de datos
        }

        // Creación de la cuenta
        const newAccount = new Account({
            username,
            bio,
            profilePicture: profilePictureUrl,
            followers,
            following,
        });

        await newAccount.save();

        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//! Obtener todas las cuentas
const getAllAccounts = async (req, res, next) => { //La función es asíncrona (async) porque realiza una operación de base de datos, que es una tarea que puede tomar tiempo (buscar todas las cuentas).
    try {
      const accounts = await Account.find(); // Buscar todas las cuentas en la base de datos
      res.status(200).json(accounts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

//! Get an account by ID
const getAccount = async (req, res, next) => {
    try {
        const account = await Account.findById(req.params.id);//consigue el id a través del path que pongas: accounts/v1/id
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });//si la cuenta no existe retornará un mensaje de error
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//! Update an account by ID
const updateAccount = async (req, res, next) => {
    try {
        const account = await Account.findById(req.params.id);//buscar la cuenta por ID
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Eliminar la imagen antigua de Cloudinary si se sube una nueva
        if (req.file && account.profilePicture) { //verificas si has subido nueva imagen y si la cuenta tiene una profilePicture
            await deleteImgCloudinary(account.profilePicture);//si se cumple, eliminas la imagen de perfil
        }

        // Subir la nueva imagen a Cloudinary si se proporciona un nuevo archivo
        if (req.file) { //comprueba si subes una nueva imagen
            const uploadResult = await cloudinary.uploader.upload(req.file.path, { //código que sube la imagen a cloudinary
                folder: 'profilePictures', // Especifica la carpeta de Cloudinary donde se subirá el archivo
            });
            account.profilePicture = uploadResult.secure_url; // Actualiza la URL de la imagen de perfil. Guarda la nueva url generada en cloudinary.
        }

        // Actualizar otros campos del perfil
        const { username, bio, followers, following } = req.body; //desestructuramos
        if (username) account.username = username;
        if (bio) account.bio = bio;
        if (followers !== undefined) account.followers = followers;
        if (following !== undefined) account.following = following;
        //?()  Estas líneas actualizan los campos de la cuenta (account) solo si los valores correspondientes fueron proporcionados en req.body. Esto permite actualizaciones parciales, donde solo los campos proporcionados se actualizan, y los demás se dejan intactos.

        await account.save();

        res.status(200).json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//! Delete an account by ID
const deleteAccount = async (req, res, next) => {
    try {
        const account = await Account.findById(req.params.id); //eliminar cuenta por su id
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Eliminar los posts asociados con esta cuenta
        const posts = await Post.find({ account: req.params.id }); //buscas todos los posts que tenga la cuenta
        if (posts.length > 0) { //si tiene algún post, que todos estos se eliminen
            await Post.deleteMany({ account: req.params.id }); //eliminar los posts
        }

        // Eliminar la imagen de perfil de Cloudinary
        if (account.profilePicture) {
            await deleteImgCloudinary(account.profilePicture); // Asegúrate de esperar a que se elimine la imagen
        }

        // Eliminar la cuenta
        await Account.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Account and associated posts and image deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = { createAccount, getAccount, updateAccount, deleteAccount, getAllAccounts };