const upload = require("../../middlewares/file");
const { createPost, getPost, updatePost, deletePost, getAllPosts } = require("../controllers/post");
const postRouter = require("express").Router();


postRouter.post('/', upload.single("image"), createPost);
postRouter.get('/:id', getAllPosts);
postRouter.get('/:id', getPost); 
postRouter.put('/:id', upload.single("image"), updatePost);
postRouter.delete('/:id', deletePost);

module.exports = postRouter;
