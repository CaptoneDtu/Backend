const ApiRes = require("../res/apiRes");

module.exports = (err, req, res, next) =>
  ApiRes.error(res, err.message, err.status || 500);
