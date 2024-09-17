const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuración dinámica de la carpeta en CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
      // Aquí puedes decidir la carpeta basándote en algún criterio
      let folderName = 'Default_Folder'; // Carpeta por defecto

      // Por ejemplo, puedes cambiar la carpeta según el tipo de modelo o ruta
      if (req.baseUrl.includes('/accounts')) {
          folderName = 'Profile_Pictures';
      } else if (req.baseUrl.includes('/posts')) {
          folderName = 'Instagram_Posts';
      }

      return {
          folder: folderName,
          allowedFormats: ['jpg', 'png', 'jpeg', 'gif']
      };
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
