const { isAuth } = require("../../middlewares/auth");
const upload = require("../../middlewares/file");
const { createPost, getPost, updatePost, deletePost, getAllPosts } = require("../controllers/post");
const postRouter = require("express").Router();


postRouter.get('/:id', getPost); // Obtener un post por ID
postRouter.post('/', isAuth, upload.single("imageUrl"), createPost); // Crear un nuevo post, solo para usuarios autenticados
postRouter.get('/', isAuth, getAllPosts); // Obtener todos los posts, solo para usuarios autenticados
postRouter.put('/:id', isAuth, upload.single("imageUrl"), updatePost); // Actualizar un post, solo para usuarios autenticados
postRouter.delete('/:id', isAuth, deletePost); // Eliminar un post, solo para usuarios autenticados


module.exports = postRouter;
