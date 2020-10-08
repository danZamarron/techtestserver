const User = require('../models/User');
const Task = require('../models/Task');

exports.getAllTasks = async (req, res, next) =>
{
    const tasks = await Task
    .find()
    .populate("userCreated")
    .populate("userAccepted");
    return res.status(200).json(tasks)
}

exports.postCreateTask = async (req, res, next) =>
{
    const { title, description } = req.body    

    if(!req.user)
    {
        res.status(401).json({ message: "no estas logeado" })
        return
    }

    let msg = "";    

    if (!title || title === "") {
        msg = "Title is required"
    }       

    if (!description || description === "") {
        const defaultMsg = "description is required"
        if(msg === "")
            msg = defaultMsg
        else
            msg +=", " + defaultMsg;
    }

    if(msg !== "")
    {
        res.status(401).json({ message: msg })
        return
    }

    const newTask = await Task.create({
      title,
      description,
      userCreated: req.user.id
    })
    res.status(201).json(newTask)
}

exports.deleteDeleteTask = async (req, res, next) => {

  const { taskId } = req.params

  if(!req.user)
  {
      res.status(401).json({ message: "no estas logeado" })
      return
  }

  const objTask = await Task.findById(taskId)

  if(objTask.userCreated != req.user.id)
  {
      res.status(403).json({ message: "Task creator can only remove it" })
      return
  }

  await Task.findByIdAndRemove(taskId)
  res.status(200).json({ message: "Task Deleted" })
}

exports.postTaskDone = async (req, res, next) => {

  if(!req.user)
  {
      res.status(401).json({ message: "no estas logeado" })
      return
  }

  const { taskId } = req.params
  const taskUpd = await Task.findByIdAndUpdate(taskId,
      {
        userAccepted: req.user.id
      },
      {
          new: true
      }
  )
  res.status(201).json(taskUpd)
}
