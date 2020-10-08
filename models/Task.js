const { Schema, model, now } = require('mongoose');

const taskSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    userCreated:
    {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    userAccepted:
    {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Task', taskSchema);