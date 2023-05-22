require("../src/db/mongoose");
const Task = require("../src/db/models/task");

Task.findByIdAndRemove("6466a2feb679b0d15d0d7171")
  .then((tasks) => {
    console.log("deleted task", tasks);

    return Task.countDocuments({ completed: false });
  })
  .then((tasks) => {
    console.log("incompleted tasks", tasks);
  });
