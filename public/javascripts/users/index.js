var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'mememarket'
})

// connection.connect()

const register = (username, password) => {
    return new Promise((resolve, reject) => {
        connection.query(
        `INSERT INTO users (username, password)
        VALUES ("${username}", "${password}")`, (err, result) => {
            if(err) {
                reject(err);
            } else {
                resolve(result.insertId);
            }
        })
    });
} 

const login = (username, password) => {
    return new Promise((resolve, reject) => {
        connection.query(
        `SELECT id FROM users 
        WHERE username = "${username}" AND password = "${password}"`, 
        (err, res) => {
            if(err) {
                reject(err);
            }
            if(res === [])
                resolve(undefined);
            resolve(res[0].id);
        })
    });
}

module.exports = {register, login};
