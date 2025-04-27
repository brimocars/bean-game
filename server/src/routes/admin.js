const router = require('express').Router();
const admin = require('../controllers/admin.js');

router.delete('/hand', admin.deleteFromHand);
router.post('/hand', admin.addToHand);
router.post('/plant', admin.plantFromAnywhereInHand);
router.delete('/plantNow', admin.deleteFromPlantNow);
router.post('/plantNow', admin.addCardToPlantNow);
router.post('/draw', admin.addCardToDraw);
router.post('/discard', admin.addCardToDiscard);
router.delete('/draw', admin.deleteCardFromDraw);
router.delete('/discard', admin.deleteCardFromDiscard);
router.post('/autoplant', admin.autoplantCardsToPlantNow);

module.exports = router;
