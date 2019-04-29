var express = require('express')
var bodyParser = require('body-parser')
 
var app = express()
const port = 3000;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// configure api routes
const api = require('./routes/userRoutes');
app.use('/user', api);

// start server
app.listen(port, (error) => {
  if(error)console.log(error);
  console.log(`server listening on ${port}`);
})
