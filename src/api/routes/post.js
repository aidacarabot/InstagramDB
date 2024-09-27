const upload = require("../../middlewares/file");
const { createPost, getPost, updatePost, deletePost, getAllPosts } = require("../controllers/post");
const postRouter = require("express").Router();


postRouter.post('/', upload.single("imageUrl"), createPost); //Crear un post
postRouter.get('/', getAllPosts); // Get all posts
postRouter.get('/:id', getPost); //Get Post By ID
postRouter.put('/:id', upload.single("imageUrl"), updatePost); //Update post
postRouter.delete('/:id', deletePost); //Delete post

module.exports = postRouter;
