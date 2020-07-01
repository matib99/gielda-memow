var sqlite3 = require('sqlite3')
const sqlite = sqlite3.verbose()

const meme_DATABASE = 'database.db'
// connection.connect()

const register = (username, password) => {
    let db = new sqlite.Database(meme_DATABASE)
    return new Promise(function(resolve, reject){
        db.run(
        `INSERT INTO users (username, password)
        VALUES ("${username}", "${password}")`, (err) => {
            if(err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    });
} 

const login = (username, password) => {
    let db = new sqlite.Database(meme_DATABASE)
    return new Promise((resolve, reject) => {
        db.get(
        `SELECT id FROM users 
        WHERE username = "${username}" AND password = "${password}"`, 
        (err, res) => {
            if(err) {
                reject(err);
            }
            if(res === undefined)
                resolve(undefined);
            resolve(res.id);
        })
    });
}

module.exports = {register, login};
