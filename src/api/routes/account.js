const upload = require('../../middlewares/file'); // Importas el middleware para manejar la subida de archivos
const { createAccount, getAccount, updateAccount, deleteAccount, getAllAccounts, login } = require('../controllers/account'); //importas controladores
const { isAuth } = require('../../middlewares/auth'); // Importa el middleware de autenticación
const accountRouter = require('express').Router();


accountRouter.post('/', upload.single("profilePicture"), createAccount); // Ruta para crear Cuenta, ponemos cloudinary por subida de imagen
accountRouter.post('/login', login); // Ruta para iniciar sesión (login)
accountRouter.get('/', isAuth, getAllAccounts); // Obtener todas las cuentas, solo para usuarios logeados.
accountRouter.get('/:id', isAuth, getAccount); // Obtener una cuenta por ID, solo para usuarios logeados.
accountRouter.put('/:id', isAuth, upload.single("profilePicture"), updateAccount); // Actualizar una cuenta, solo para usuarios logeados.
accountRouter.delete('/:id', isAuth, deleteAccount); // Eliminar una cuenta, solo para usuarios logeados.

module.exports = accountRouter;
