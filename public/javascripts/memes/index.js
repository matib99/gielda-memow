// import { memeList } from './const'
  
// var data = require('./memeList.json');
// var memeList = data.memes;


var memeObj;

const listPath = "./public/json/memeList.json";

const getMemeList = () => {
    if(memeObj === undefined)
        memeObj = readList(listPath);
    if(memeObj.memes === undefined)
        return []
    else
        return memeObj.memes;
}

const getMeme = (id) => {
    var memeList = getMemeList();
    if(id < 0 || id >= memeList.length)
        return null;
    else 
        return memeList[id];
}

const getTop = (n) =>  {
    var memeList = getMemeList();
    
    let toplist = [...memeList].sort(
        (a, b) => {
            return Math.sign(b.price - a.price)
        }
    )
    if(n >= 0) 
        toplist = toplist.slice(0, n);

    var data = {
        memes: toplist
    }

    return toplist;
}

const newPrice = (id, price) => {
    var memeList = getMemeList();
    
    if(id < 0 || id >= memeList.length)
        return;
    var current_datetime = new Date();
    let formatted_date = current_datetime.getFullYear() 
                 + "-" + (current_datetime.getMonth() + 1)
                 + "-" + current_datetime.getDate()
                 + " " +current_datetime.getHours() 
                 + ":" + current_datetime.getMinutes() 
                 + ":" + current_datetime.getSeconds() 

    memeList[id].priceHistory = [ {
        date: formatted_date,
        value: price
    }, ...memeList[id].priceHistory];
    memeList[id].price = price;
    saveList(memeObj, listPath);
}


const addMeme = (name, url, price) => {
    var memeList = getMemeList();
    const id = memeList.length;
    const meme = {
        id: id,
        name: name,
        url: url,
        price: 0,
        priceHistory: []
    }
    memeList = [...memeList, meme];
    memeObj.memes = memeList;
    newPrice(id, price);
}



const readList = (file) => {
    var fs = require('fs');
    let rawdata = fs.readFileSync(file, 'utf8');
    return JSON.parse(rawdata);
}

// "./public/json/memeList.json"

const saveList = (data, file) => {
    var fs = require('fs');
    fs.writeFile(file, JSON.stringify(data), function(err) {
        if (err) {
            console.log(err);
        }
    });
}
    

module.exports = {getMeme, getTop, newPrice, addMeme};
