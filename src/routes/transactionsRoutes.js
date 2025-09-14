const express = require('express');
const transactionsController = require('../controllers/transactionsController');
const { validateTransaction } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/transactions', authMiddleware, validateTransaction, transactionsController.addTransaction);
router.get('/transactions', authMiddleware, transactionsController.listTransactions);
router.put('/transactions/:id', authMiddleware, validateTransaction, transactionsController.updateTransaction);
router.delete('/transactions/:id', authMiddleware, transactionsController.deleteTransaction);

module.exports = router;