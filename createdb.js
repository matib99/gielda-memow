const sqlite3 = require('sqlite3')

const meme_DATABASE = 'database.db'
const sqlite = sqlite3.verbose()

const memeList = require('./public/json/memeList.json')
const { getDate } = require('./public/javascripts/memes')

const dropTables = () => {
    return new Promise((resolve, reject) => {
        let db = new sqlite.Database(meme_DATABASE)
        db.run(`DROP TABLE IF EXISTS memes`)
        db.run(`DROP TABLE IF EXISTS prices`)
        db.run(`DROP TABLE IF EXISTS users`)
        db.close((err) => {
            if (err)
                reject(err)
            resolve()
        })
    })
    
}

const createTables = () => {
    return new Promise((resolve, reject) => {
        let db = new sqlite.Database(meme_DATABASE)
        
        db.run(`
            CREATE TABLE memes 
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR NOT NULL,
                fileurl VARCHAR NOT NULL,
                price INTEGER NOT NULL
            )
        `)
        
        db.run(`
            CREATE TABLE users
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR NOT NULL UNIQUE,
                password VARCHAR NOT NULL
            )   
        `)
        
        db.run(`
            CREATE TABLE prices
            (
                memeid INTEGER NOT NULL REFERENCES memes(id),
                price INTEGER NOT NULL,
                changedate DATETIME NOT NULL,
                userid INTEGER NOT NULL REFERENCES users(id)
            )
        `)

        db.close((err) => {
            if (err)
                reject(err)
            resolve()
        })
    })
}

const addUsers = () => {
    let db = new sqlite.Database(meme_DATABASE)
    db.run(`
        INSERT INTO users (username, password)
        VALUES ('user1', 'user1')
    `)

    db.run(`
        INSERT INTO users (username, password)
        VALUES ('user2', 'user2')
    `)
} 

const addMeme = (meme) => {
    
        let db = new sqlite.Database(meme_DATABASE)
        let meme_id = -1
        db.run(`INSERT INTO memes (title, fileurl, price) VALUES ('${meme.name}', '${meme.url}', ${meme.price})`, function(err){
            if(err) {console.log("ERR", err); return}
            meme_id = this.lastID
            db.run(`INSERT INTO prices (memeid, price, changedate, userid) 
                        VALUES (${meme_id},'${meme.price}', '${getDate()}', 1)`, (err) => {
                            if(err) console.log("ERR", err)
        })
    })
}
const createdb = async () => {
    dropTables().then(() => {
        createTables().then(async () => {
            addUsers()
            for(let meme of memeList.memes) {
                addMeme(meme)
            }
        }).catch(
            (reason) => {
                console.log(reason)
            }
        )
    })
}
createdb();
