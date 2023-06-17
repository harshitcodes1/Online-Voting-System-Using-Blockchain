var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/logout', function(req, res) {
  req.session.destroy();
  //res.history('/');
  res.redirect('/');
});
module.exports = router;