var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'mememarket'
})

connection.connect()

const getMeme = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
        `SELECT * FROM memes WHERE id = ${id}`,
        (err, rows, fields) => {
            if (err) {
                // connection.end();
                return reject(err);
            }
            var meme = rows[0];
            if(meme === undefined) {
                // connection.end();
                resolve(undefined)
            }
            else {
                connection.query(
                `SELECT price, changedate, username FROM prices LEFT JOIN users ON prices.userid = users.id WHERE memeid = ${id} ORDER BY changedate DESC`,
                (err, rows, fields) => {
                    if (err) {
                        // connection.end();
                        return reject(err);
                    }
                    meme.priceHistory = rows;
                    // connection.end();
                    resolve(meme);
                })
            }
        });
    });
}

const getTop = (n) =>  {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM memes ORDER BY price ${(n > 0) ? `LIMIT ${n} ` : ``} `,
        (err, rows, fields) => {
            if (err) {
                // connection.end();
                return reject(err);
            }
            // connection.end();
            resolve(rows);
        });
    });
}

const newPrice = (id, price, userid=0) => {
    connection.beginTransaction( (err) =>{
        if(err) {
            // connection.end();
            throw err;
        }
        connection.query(
        `UPDATE memes SET price=${price}
        WHERE id=${id}`,
        (err) => {
            if(err) {
                connection.rollback();
                // connection.end();
                throw err;
            } 
            else {
                connection.query(
                `INSERT INTO prices (memeid, price, changedate, userid)
                VALUES (${id}, ${price}, "${getDate()}", ${userid})`, 
                (err) => {
                    if(err) {
                        connection.rollback();
                        // connection.end();
                        throw err;
                    } 
                    else {
                        connection.commit((err)=>{
                            if(err) connection.rollback();
                            // connection.end();
                        })
                        
                    }
                })
            }
        })
    });
}


const addMeme = (title, fileurl, price, userid) => {
    connection.beginTransaction( (err) =>{
        if(err) {
            // connection.end();
            throw err;
        }
        connection.query(
        `INSERT INTO memes (title, price, fileurl)
        VALUES (${title}, ${price}, ${fileurl})`,
        (err, res) => {
            if(err) {
                connection.rollback();
                // connection.end();
                throw err;
            } 
            else {
                connection.query(
                `INSERT INTO prices (memeid, price, changedate, userid)
                VALUES (${res.insertId}, ${price}, "${getDate()}", ${userid})`, 
                (err) => {
                    if(err) {
                        connection.rollback();
                        // connection.end();
                        throw err;
                    } 
                    else {
                        connection.commit((err)=>{
                            if(err) connection.rollback();
                            // connection.end();
                        })
                        
                    }
                })
            }
        })
    });
}



const getDate = () => {
    // oczywiście to jest data UTC, ponieważ nasza giełda to poważny międzynarodowy biznes
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
    return date;
}

module.exports = {getMeme, getTop, newPrice, addMeme};
