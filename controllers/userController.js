// import models for database queries
const user = require('../models/userModel');

module.exports = {
  // attempt to create new user
  signup: async (req, res) => {    
    let newUser = await user.signup(req.body);
    res.json(newUser);
  },
  // verify user and send token
  login: async (req, res) => {
    let userLogin = await user.login(req.body);
    res.json(userLogin);
  },
  post: async (req, res) => {    
    let newUser = await user.post(req.body);
    res.json(newUser);
  },
  // return user info
  getInfo: async (req, res) => {    
    let info = await user.findById(req.body.userId);    
    res.json(info);
  }
 
}
