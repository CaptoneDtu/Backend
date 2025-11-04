

const express = require('express');
const auth = require('../middleware/auth.middleware');
const { validateBody, validateQuery } = require('../middleware/validate');
const { createUserSchema, getUsersSchema, changePasswordSchema } = require('../validators/users.validator');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.post('/create-user', auth(['admin']), validateBody(createUserSchema), userController.createUser);
router.get('/get-users', auth(['admin']), validateQuery(getUsersSchema), userController.getUsers);
router.delete('/delete-user/:userId', auth(['admin']), userController.deleteUser);
router.get('/get-user/:id', auth(['admin']), userController.getUserById);

router.put("/change-password", auth(['admin', 'teacher', 'student']), validateBody(changePasswordSchema), userController.changePassword);


module.exports = router;