class ApiRes {
  static send(res, { status, success, message, data = null }) {
    return res.status(status).json({ status, success, message, data })
  }

  static success(res, message, data = null) {
    return this.send(res, { status: 200, success: true, message, data })
  }

  static error(res, message, status = 400) {
    return this.send(res, {
      status: status instanceof Error ? status.status || 500 : status,
      success: false,
      message
    })
  }
}

module.exports = ApiRes
