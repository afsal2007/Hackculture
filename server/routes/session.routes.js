const express = require('express');
const { sessionController } = require('../controllers/session.controller');
const { validate } = require('../middleware/validate');
const { sessionValidator } = require('../validators/session.validator');

const router = express.Router();

router.route('/')
  .get(validate(sessionValidator.listSessions), sessionController.getSessions)
  .post(validate(sessionValidator.createSession), sessionController.createSession);

router.route('/:id')
  .get(validate(sessionValidator.idParam), sessionController.getSessionById)
  .put(validate(sessionValidator.updateSession), sessionController.updateSession)
  .delete(validate(sessionValidator.idParam), sessionController.deleteSession);

router.route('/:id/history')
  .get(validate(sessionValidator.idParam), sessionController.getSessionHistory);

module.exports = router;
