const {Router} = require('express')

const router = Router();

const {registerUser,loginUser,getUser,changAvatar,editUser,getAuthors} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware')

// router.get('/',(req,res,next) => {
//     res.json('This is The User Router')
// })

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/:id',getUser)
router.get('/',getAuthors)
router.post('/change-avatar', authMiddleware, changAvatar)
router.patch('/edit-user', authMiddleware, editUser)
module.exports = router