const upload = require('../../middlewares/file'); // Importas el middleware para manejar la subida de archivos
const { createAccount, getAccount, updateAccount, deleteAccount, getAllAccounts } = require('../controllers/account'); //importas controladores
const { isAuth } = require('../../middlewares/auth'); // Importa el middleware de autenticación

const accountRouter = require('express').Router();// Creas una instancia de Router de Express, que es un mini-objeto de aplicación Express que solo maneja rutas.


accountRouter.post('/', upload.single("profilePicture"), createAccount); // Usas el middleware para manejar la subida de una sola imagen en el campo profilePicture.
accountRouter.get('/', isAuth, getAllAccounts); // Obtener todas las cuentas, solo para usuarios autenticados
accountRouter.get('/:id', isAuth, getAccount); // Obtener una cuenta por ID, solo para usuarios autenticados
accountRouter.put('/:id', isAuth, upload.single("profilePicture"), updateAccount); // Actualizar una cuenta, solo para usuarios autenticados
accountRouter.delete('/:id', isAuth, deleteAccount); // Eliminar una cuenta, solo para usuarios autenticados

module.exports = accountRouter;
