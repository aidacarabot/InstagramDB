const upload = require("../../middlewares/file");
const { createPost, getPost, updatePost, deletePost, getAllPosts } = require("../controllers/post");
const postRouter = require("express").Router();


postRouter.post('/', upload.single("image"), createPost);
postRouter.get('/:id', upload.single("image"), getAllPosts);
postRouter.get('/:id', upload.single("image"), getPost);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);

module.exports = postRouter;
