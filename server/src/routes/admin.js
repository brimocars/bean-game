const router = require('express').Router();
const admin = require('../controllers/admin.js');

router.delete('/hand', admin.deleteFromHand);
router.post('/hand', admin.addToHand);

module.exports = router;
