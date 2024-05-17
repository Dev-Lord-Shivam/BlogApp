const {Router} = require('express')
const {createPost ,getPost, getPosts, getPostsByCategory, getUserPosts,editPost,deletePost} = require('../controllers/postController')
const authMiddleware = require('../middleware/authMiddleware');


const router = Router();

router.post('/',authMiddleware,createPost)
router.get('/',getPosts)
router.get('/:id',getPost)
router.patch('/:id',authMiddleware,editPost)
router.get('/categories/:category',getPostsByCategory)
router.get('/users/:id',getUserPosts)
router.delete('/:id',authMiddleware,deletePost)


module.exports = router