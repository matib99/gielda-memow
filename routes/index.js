const { getMeme, getTop, newPrice, addMeme } = require('../public/javascripts/memes');
const { login, register } = require('../public/javascripts/users');

var express = require('express');
var router = express.Router();
var csurf = require('csurf');

var csrfProtection = csurf({ cookie: true });

/* GET home page. */
router.get('/', csrfProtection, (req, res, next) => {
  getTop(3)
  .then(memeList => {
    res.render('index', { title: 'GIEŁDA MEMÓW', memes: memeList, message: "TOP 3 MEMY", logged: (req.session.userID)});
  })
  .catch(err => {
    console.log(err)
  })
 
});

router.get('/meme/all', csrfProtection, (req, res) => {
  getTop(-1)
  .then(memeList => {
    res.render('index', { title: 'GIEŁDA MEMÓW', memes: memeList, message: "Wszystkie memy", logged: (req.session.userID)});
  })
  .catch(err => {

  })
})

router.get('/meme/add', csrfProtection, (req, res) => {
  res.render('newmeme', { csrfToken: req.csrfToken() });
  res.status(200);
})

router.get('/meme/:id', csrfProtection, (req, res, next) => {
  getMeme(req.params.id)
  .then(meme=>{
    if(meme === undefined) {
      res.render('statuscode', { code: 204, message: 'Mema nie znaleziono'});
      res.status(204);
    }
    else {
      res.render('meme', { title: 'GIEŁDA MEMÓW', meme: meme, message: "Szczegóły mema", csrfToken: req.csrfToken(), logged: (req.session.userID)});
      res.status(200);
    }
  })
});

router.post('/meme', csrfProtection, (req, res) => {
  if(req.session.userID === undefined) {
    res.render('statuscode', { code: 403, message: 'Nie masz uprawnień'});
    res.status(403);
  } else {
    const {title, fileurl, price } = req.body;
    addMeme(title, fileurl, parseInt(price), req.session.userID);
    res.status(200);
    res.redirect('/');
  }
})

router.post('/meme/:id', csrfProtection, (req, res) => {
  if(req.session.userID === undefined) {
    res.render('statuscode', { code: 403, message: 'Nie masz uprawnień'});
    res.status(403);
  } else {
    newPrice(req.params.id, parseInt(req.body.price), req.session.userID);
    res.redirect(`../meme/${req.params.id}`);
  }
})

router.get('/login', (req, res) => {
  res.render('login', { login, logged: (req.session.userID !== undefined) });
  res.status(200);
})

router.get('/register', (req, res) => {
  res.render('login', { register, logged: (req.session.userID !== undefined) });
  res.status(200);
})

router.get('/logout', (req, res) => {
  req.session.userID = undefined;
  res.status(200);
  res.redirect('/');
})

router.post('/login', (req, res) => {
  login(req.body.username, req.body.password)
  .then((userID) => {
    if(userID === undefined) {
      res.render('statuscode', { code: 403, message: 'Złe dane logowania'});
      res.status(403);
    } else {
      req.session.userID = userID;
      res.status(200);
      res.redirect('/');
    }
  })
  .catch(err=>{
    res.status(500);
    res.render('statuscode', { code: 403, message: 'Coś się popsuło, i to moja wina'});
  })
})

router.post('/register', (req, res) => {
  register(req.body.username, req.body.password)
  .then((userID) => {
      req.session.userID = userID;
      res.status(200);
      res.redirect('/');
  })
  .catch(err=>{
    res.status(500);
    res.render('statuscode', { code: 403, message: 'Coś się popsuło, i to moja wina'});
  })
})



router.get('*', (req, res) => {
  res.render('statuscode', { code: 404, message: 'Strony nie odnaleziono'});
  res.status(404);
});





module.exports = router;
