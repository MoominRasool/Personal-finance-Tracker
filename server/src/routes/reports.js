const { Router } = require('express');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/reportController');

const router = Router();

router.use(auth);
router.get('/category', ctrl.spendByCategory);
router.get('/month', ctrl.spendByMonth);

module.exports = router;


