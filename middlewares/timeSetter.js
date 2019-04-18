module.exports = function(req, res, next) {
  if (req.body) {
    req.body.time = Date.now();
  }
  next();
}