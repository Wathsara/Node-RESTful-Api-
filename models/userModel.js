// get database for query function
const db = require('../util/database');
// bcrypt for passwords
const bcrypt = require('bcryptjs');
// jwt for tokens
const jwt = require('jsonwebtoken');
// get config for secret
const config = require('../util/config');

// setup user table
db.query("CREATE TABLE IF NOT EXISTS users (userID INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(25) NOT NULL ,username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL,firstName VARCHAR(255) NOT NULL,lastName VARCHAR(255) NOT NULL,avatarURL VARCHAR(255) NOT NULL,userLevel VARCHAR(255) NOT NULL,enableFlag VARCHAR(255) NOT NULL,createdAt TIMESTAMP NOT NULL , updatedAt TIMESTAMP NOT NULL)");
db.query("CREATE TABLE IF NOT EXISTS posts (postID INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, content VARCHAR(255) NOT NULL,categoryID VARCHAR(255) NOT NULL,remarks VARCHAR(255) NOT NULL,publish VARCHAR(255) NOT NULL,createdAt TIMESTAMP NOT NULL , updatedAt TIMESTAMP NOT NULL)");
var token=null
var userId=null
module.exports = { 
   
  signup: async (input) => {
    // check for required fields    
    console.log("username"+input.username)
    if(!input.username || !input.password) return {success: false, error: 'invalid username or password'};
    // check for existing user
    let testUser = await db.query(`SELECT * FROM users WHERE username='${input.username}'`);
    // return error if duplicate
    if(testUser.rows[0]) return {success: false, error: 'user exists'};
    //hash password before saving
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(input.password, salt);
    // create new user
    let newUser = await db.query(`INSERT INTO users(username, password,title, firstName, lastName, avatarURL, enableFlag, userLevel) VALUES('${input.username}', '${hash}','${input.title}','${input.firstName}','${input.lastName}','${input.avatarURL}','${input.enableFlag}','${input.userLevel}')`);
    let userInfo = await db.query(`SELECT userId FROM users WHERE username='${input.username}'`);
    userId = userInfo.rows[0].userId;
    token = jwt.sign({id: userId}, config.secret);
    // return message
    return {success: true, msg: 'user created', token, userId};
  },

  findById: async (id) => {
    if(!id) return {success: false, error: 'invalid id'};
    let user = await db.query(`SELECT * FROM users WHERE userId=${id}`);
    if(!user.rows[0]) return {success: false, error: 'no user found'};
    user = user.rows[0];
    return {user};
  },

  login: async (input) => {
    // check for required fields
    if(!input.username || !input.password) return {success: false, error: 'invalid username or password'};
    // check for existing user
    let user = await db.query(`SELECT * FROM users WHERE username='${input.username}'`);
    // return error if user not found
    if(!user.rows[0]) return {success: false, error: 'user not found'};
    // compare passwords
    const hash = user.rows[0].password;
    if(bcrypt.compareSync(input.password, hash)){
      let userInfo = await db.query(`SELECT userId FROM users WHERE username='${input.username}'`);
      userId = userInfo.rows[0].userId;
      token = jwt.sign({id: user.rows[0].userId}, config.secret);
     
      return {success: true, msg: 'logged in', token, userId};
    }else{
      return {success: false, msg: 'invalid username or password'};
    }
  },

  post: async (input) => {
    // check for required fields
    if(!token || !userId) return {success: false, error: 'Please LogIn'};
    if(!input.title || !input.content ||!input.categoryID ||!input.remarks ||!input.publish) return {success: false, error: 'invalid number of arguments'};
    let newPost = await db.query(`INSERT INTO posts(title,content,categoryID,remarks,publish) VALUES('${input.title}','${input.content}','${input.categoryID}','${input.remarks}','${input.publish}')`);
    return {success: true, msg: 'post Created', token}; 
  }
}
