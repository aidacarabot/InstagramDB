const multer = require('multer'); // Importa multer, un middleware para manejar la subida de archivos en Node.js
const cloudinary = require('cloudinary').v2; // Importa el SDK de Cloudinary para interactuar con su API
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Importa el almacenamiento de Cloudinary para integrarlo con multer

// Configuración del almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Asocia la configuración de Cloudinary previamente inicializada

  params: {
      folder: 'Instagram_Project', // Todas las imágenes se guardarán en la carpeta 'Instagram_Project' en Cloudinary
      allowedFormats: ['jpg', 'png', 'jpeg', 'gif'] // Especifica los formatos permitidos para los archivos subidos
  }
});

const upload = multer({ storage: storage }); // Configura multer para usar el almacenamiento en Cloudinary

module.exports = upload; // Exporta la configuración de multer para que pueda ser utilizada en las rutas de la aplicación
