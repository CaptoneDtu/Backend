const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const ApiRes = require('../res/apiRes')

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiRes.error(res, 'Unauthorized: No valid token provided', 401)
    }

    const token = authHeader.split(' ')[1]
    if (!token || token.split('.').length !== 3) {
      return ApiRes.error(res, 'Unauthorized: Invalid token format', 401)
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret')
    } catch (error) {
      return ApiRes.error(res, 'Unauthorized: Invalid or expired token', 401)
    }

    if (!decoded || !decoded.id) {
      return ApiRes.error(res, 'Invalid token payload', 401)
    }

    const user = await userModel.findById(decoded.id).select('-password').lean()
    if (!user) {
      return ApiRes.error(res, 'User not found', 404)
    }

    req.user = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      roles: user.roles
    }

    next()
  } catch (error) {
    console.log('Error in authenticateJWT:', error.message)
    return ApiRes.error(res, 'Server error while authenticating', 500)
  }
}

const authorizeRole = (roles) => (req, res, next) => {
  console.log('roles', req.user.roles)

  if (!roles.includes(req.user.roles)) {
    return ApiRes.error(res, 'Forbidden: Access denied')
  }
  next()
}

module.exports = { authenticateJWT, authorizeRole }
