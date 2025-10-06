class AppError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = Number.isInteger(status) ? status : 400
  }
}

module.exports = AppError
