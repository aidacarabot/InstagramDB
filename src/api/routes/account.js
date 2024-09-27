const upload = require('../../middlewares/file'); // Importas el middleware para manejar la subida de archivos
const { createAccount, getAccount, updateAccount, deleteAccount, getAllAccounts } = require('../controllers/account'); //importas controladores

const accountRouter = require('express').Router();// Creas una instancia de Router de Express, que es un mini-objeto de aplicación Express que solo maneja rutas.


accountRouter.post('/', upload.single("profilePicture"), createAccount); // Usas el middleware para manejar la subida de una sola imagen en el campo profilePicture.
accountRouter.get('/', getAllAccounts);
accountRouter.get('/:id', getAccount);
accountRouter.put('/:id', upload.single("profilePicture"), updateAccount);// Puedes estar subiendo archivos, osea que mejor poner el middleware
accountRouter.delete('/:id', deleteAccount);

module.exports = accountRouter;
