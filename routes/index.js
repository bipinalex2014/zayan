var express = require('express');
var router = express.Router();
var userHelper = require('../helper/user-helper');
var dateFormat = require('dateformat');
var bcrypt = require('bcrypt');


const verifyLogin = ((req, res, next) => {
  if (req.session.userSession) {
    next();
  }
  else {
    res.redirect('/');
  }
})



router.get('/', function (req, res) {
  res.render('index', { err: req.session.logErr });
  req.session.logErr = null;
});
router.post('/', function (req, res) {
  let data = req.body;
  userHelper.getLogin(data).then((result) => {
    if (result.status) {
      req.session.userSession = data.username;
      res.redirect('/view-customer/')
    }
    else {
      req.session.logErr = result.msg;
      res.redirect('/');
    }
  })
})
router.get('/sign-up', (req, res) => {
  res.render('signup', { err: req.session.signUpErr });
  req.session.signUpErr = null;
})
router.post('/sign-up', async (req, res) => {
  let userData = req.body;
  userData.password = await bcrypt.hash(userData.password, 8);
  delete userData.confirmpassword;
  userHelper.createUser(userData).then((result) => {
    if (!result.status) {
      req.session.signUpErr = result.message
      res.redirect('/sign-up');
    }
    else {
      res.redirect('/');
    }
  })
})
router.get('/zayan-customer-form', verifyLogin, function (req, res) {
  res.render('user/customer-data',{user:req.session.userSession})
})

router.post('/zayan-customer-form', verifyLogin, function (req, res) {
  let customerData = req.body
  userHelper.setCustomerData(customerData).then((data) => {
    res.redirect('/zayan-customer-form/')
  })
})

router.get('/view-customer', verifyLogin, function (req, res) {
  userHelper.getCustomerData().then((data) => {
    if (data) {
      data.forEach(element => {
        element.date = dateFormat(element.date, "dd-mm-yyyy");
      });
    }
    res.render('user/view-data', { data,user:req.session.userSession })
  })
})
router.get('/todays-birthdays', verifyLogin, function (req, res) {
  let today = new Date()
  let dateformat = dateFormat(today, "dd-mm-yyyy")
  let now = dateformat.split('-').slice(-1)[0]
  userHelper.getBirthdayDate().then((data) => {
    data.forEach((element) => {
      element.date = dateFormat(element.date, "dd-mm-yyyy")
      let date = element.date
      let dt = date.split('-').slice(-1)[0]
      let age = now - dt
      element.age = age
    })
    res.render('user/todays-birthdays', { data,user:req.session.userSession })
  })
})
router.get('/birthday-wish/:id', verifyLogin, function (req, res) {
  let dataId = req.params.id
  console.log('ddsdfsdsadf', dataId)
  userHelper.doBirthdayWish(dataId).then((data) => {
    console.log('data')
    res.redirect('/todays-birthdays')
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.redirect(req.get('referer'))
  res.redirect('/');
})


module.exports = router;
