// jwt used for token
var jwt = require('jsonwebtoken');
// config for secret
var config = require('./config');

verifyToken = module.exports = (req, res, next) => {
  // send token in headers as 'x-access-token'
  const token = req.headers['x-access-token'];
  // if no token sent return error
  if(!token) return res.json({success: false, error: 'no token provided'});
  jwt.verify(token, config.secret, (error, decoded) => {
    // if token is wrong return error
    if(error) return res.json({success: false, error: 'failed to authenticate token'});
    // set userid as decoded token id
    req.userId = decoded.id;
    next();
  });
}
