const express = require('express');
const { historyController } = require('../controllers/history.controller');
const { validate } = require('../middleware/validate');
const { historyValidator } = require('../validators/history.validator');

const router = express.Router();

router.route('/')
  .get(validate(historyValidator.listHistory), historyController.getHistory)
  .post(validate(historyValidator.createHistoryEntry), historyController.createHistoryEntry);

router.route('/:id')
  .get(validate(historyValidator.idParam), historyController.getHistoryById)
  .delete(validate(historyValidator.idParam), historyController.deleteHistoryEntry);

module.exports = router;
