const { getMeme, getTop, newPrice, addMeme } = require('../public/javascripts/memes');

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'GIEŁDA MEMÓW', memes: getTop(3), message: "TOP 3 MEMY"});
});

router.get('/meme/all', (req, res) => {
  res.render('index', { title: 'GIEŁDA MEMÓW', memes: getTop(-1), message: "Wszystkie memy"});
})

router.get('/meme/add', (req, res) => {
  res.render('newmeme', {});
  res.status(200);
})

router.get('/meme/:id', (req, res, next) => {
  const meme = getMeme(req.params.id);
  if(meme == null) {
    res.render('statuscode', { code: 204, message: 'Mema nie znaleziono'});
    res.status(204);
  }
  else {
    res.render('meme', { title: 'GIEŁDA MEMÓW', meme: meme, message: "Szczegóły mema"});
    res.status(200);
  }
    
});

router.post('/meme', (req, res) => {
  console.log(req.body);
  const {name, url, price } = req.body;
  addMeme(name, url, parseInt(price));
  res.status(200);
  res.redirect('/');
})

router.post('/meme/:id', (req, res) => {
  let meme = getMeme(req.params.id);
  newPrice(req.params.id, parseInt(req.body.price));
  res.render('meme', { meme: meme })
})



router.get('*', (req, res) => {
  res.render('statuscode', { code: 404, message: 'Strony nie odnaleziono'});
  res.status(404);
});

module.exports = router;
