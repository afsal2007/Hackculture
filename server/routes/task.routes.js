const express = require('express');
const { taskController } = require('../controllers/task.controller');
const { validate } = require('../middleware/validate');
const { taskValidator } = require('../validators/task.validator');

const router = express.Router();

router.get('/stats/summary', taskController.getArenaStats);

router.route('/')
  .get(validate(taskValidator.listTasks), taskController.getTasks)
  .post(validate(taskValidator.createTask), taskController.createTask);

router.route('/:id')
  .get(validate(taskValidator.idParam), taskController.getTaskById)
  .put(validate(taskValidator.updateTask), taskController.updateTask)
  .delete(validate(taskValidator.idParam), taskController.deleteTask);

router.patch('/:id/status', validate(taskValidator.updateStatus), taskController.updateStatus);
router.put('/:id/web-data', validate(taskValidator.saveTavilyData), taskController.saveTavilyData);
router.put('/:id/agent-results', validate(taskValidator.saveAgentResults), taskController.saveAgentResults);
router.put('/:id/evaluation', validate(taskValidator.saveEvaluation), taskController.saveEvaluation);
router.put('/:id/briefing', validate(taskValidator.saveFinalBriefing), taskController.saveFinalBriefing);
router.post('/:id/simulate', validate(taskValidator.idParam), taskController.simulateArenaRun);
router.get('/:id/export/markdown', validate(taskValidator.idParam), taskController.exportBriefing);

module.exports = router;
