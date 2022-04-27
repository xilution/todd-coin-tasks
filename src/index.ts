import { handleTask } from "./handle-task";

handleTask()
  .catch((error: Error) => console.error(error.message))
  .finally();
