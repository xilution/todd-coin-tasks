import { handleTask } from "./handle-task";

handleTask()
  .then(() => console.log("All Done!"))
  .catch((error: Error) => console.error(error.message))
  .finally();
