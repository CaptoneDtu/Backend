const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user.controller')
const { authenticateJWT } = require('../middleware/auth.middleware')

router.post('/forgot-password', UserController.forgotPassword)
router.post('/reset-password', UserController.resetPassword)

// Các route dưới đây yêu cầu đăng nhập
router.post('/change-password', authenticateJWT, UserController.changePassword)
router.put('/profile', authenticateJWT, UserController.updateProfile)
router.post('/logout-all', authenticateJWT, UserController.logoutAll)
router.get('/profile', authenticateJWT, UserController.getProfileUser)

module.exports = router
