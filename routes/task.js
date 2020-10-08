const { Router } = require('express');
const router  = new Router();

const {catchErrors} = require("../middlewares/index")

const{
  getAllTasks,
  postCreateTask,
  deleteDeleteTask,
  postTaskDone
} = require ("../controllers/task")

router.get('/', catchErrors(getAllTasks));
router.post('/', catchErrors(postCreateTask));
router.delete('/delete/:taskId', catchErrors(deleteDeleteTask));
router.put('/done/:taskId', catchErrors(postTaskDone));

module.exports = router;