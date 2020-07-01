var sqlite3 = require('sqlite3')
const sqlite = sqlite3.verbose()

const meme_DATABASE = 'database.db'
let db = new sqlite.Database(meme_DATABASE)
// sqlite3.Database.prototype.runBatchAsync = function (statements) {
//     var results = [];
//     var batch = ['BEGIN', ...statements, 'COMMIT'];
//     return batch.reduce((chain, statement) => chain.then(result => {
//         results.push(result);
//         return db.run(...[].concat(statement));
//     }), Promise.resolve())
//     .catch(err => db.run('ROLLBACK').then(() => Promise.reject(err +
//         ' in statement #' + results.length)))
//     .then(() => results.slice(2));
// };

const getMeme = (id) => {
    return new Promise((resolve, reject) => {
        db.get(
        `SELECT * FROM memes WHERE id = ${id}`,
        (err, meme) => {
            if (err) {
                return reject(err);
            }
            if(meme === undefined) {
                resolve(undefined)
            }
            else {
                db.all(
                `SELECT price, changedate, username FROM prices LEFT JOIN users ON prices.userid = users.id WHERE memeid = ${id} ORDER BY changedate DESC`,
                (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    meme.priceHistory = rows;
                    resolve(meme);
                })
            }
        });
    });
}

const getTop = (n) =>  {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM memes ORDER BY price DESC ${(n > 0) ? `LIMIT ${n} ` : ``} `,
        (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}



const newPrice = (id, price, userid=0) => {
    var statements = [
        `UPDATE memes SET price=${price} WHERE id=${id};`,
        `INSERT INTO prices (memeid, price, changedate, userid) VALUES (${id}, ${price}, "${getDate()}", ${userid});`
    ];

    return new Promise((resolve, reject) => {
        db.run( statements[0], (err) => {
            if(err) {
                reject(err)
            } else {
                db.run( statements[1], (err) => {
                    if(err) reject(err)
                    else resolve()
                })
            }
        })
    })
    
}


const addMeme = (title, fileurl, price, userid) => {
    var statements = [
        `INSERT INTO memes (title, price, fileurl) VALUES (${title}, ${price}, ${fileurl});`,
        `INSERT INTO prices (memeid, price, changedate, userid) VALUES (${res.insertId}, ${price}, "${getDate()}", ${userid});`
    ];

    return new Promise((resolve, reject) => {
        db.run( statements[0], (err) => {
            if(err) {
                reject(err)
            } else {
                db.run( statements[1], (err) => {
                    if(err) reject(err)
                    else resolve()
                })
            }
        })
    })

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

module.exports = {getMeme, getTop, newPrice, addMeme, getDate};
