// import credentials for db
const config = require('./config');

module.exports = {
  // master query function
  query: async (sql) => {
    // using mysql2 with promises for database connection
    const mysql = require('mysql2/promise');
    // create the connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: config.username,
      password: config.password,
      database: config.database
    });
    // query database
    const [rows, fields] = await connection.execute(sql);
    return {rows, fields};
  }
}
