const connect = require("./config/db");
const User = require("./models/user");
const Task = require("./models/task");
connect();

const updateAgeCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });

  return {
    user,
    count,
  };
};

const deleteTaskCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return {
    task,
    count,
  };
};

deleteTaskCount("61a8eeee47223992553acc00")
  .then((res) => {
    console.log(res.count);
  })
  .catch((e) => console.log(e));
