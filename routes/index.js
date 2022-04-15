const { response } = require('express');
var express = require('express');
const session = require('express-session');
var router = express.Router();
const userHelpers = require("../helpers/userHelpers");
const verifylogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};





/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { loggin: req.session.loggedIn })

});
router.get("/login", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});


router.get('/signup', (req, res) => {
  res.render('register')
})
router.post('/signup', (req, res) => {
  userHelpers.signUp(req.body).then((response) => {
    // console.log(response)
    res.render("login")
  })
})

router.post('/login', (req, res) => {
  userHelpers.loginCheck(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      console.log('user check')
      console.log(response.user)
      console.log(req.session.user)
      res.redirect('/');
    } else {
      req.session.loginErr = "Incorrect Email or Password";
      res.redirect("/login");
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/')
});

router.get('/friendlist', verifylogin, async (req, res) => {
  let friends = await userHelpers.getFriends(req.session.user._id)
  console.log(friends)
  res.render('friends', { friends: friends })
})

router.get('/addfriend/:id', (req, res) => {
  console.log(req.session.user,req.params.id)
  userHelpers.makeFriends(req.params.id, req.session.user._id).then((response) => {
    res.json({ status: true })
  })
})

router.get('/removeFriend/:id', (req, res) => {
  console.log(req.session.user,req.params.id)
  userHelpers.deleteFriends(req.params.id, req.session.user._id).then((response) => {
    res.json({ status: true })
  })
})

router.get('/myprofile',verifylogin,(req,res)=>{
  res.render('addpost')
})

router.post('/myprofile',(req,res)=>{
  console.log(req.files,req.body)
  userHelpers.addpost(req.body,(id)=>{ 

  })
})

module.exports = router;
