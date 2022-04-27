import doInit from "./services/init-service";
import doMine from "./services/mine-service";
import doSync from "./services/sync-service";
import doValidate from "./services/validation-service";
import _ from "lodash";

const operationMap: { [operation: string]: () => Promise<void> } = {
  INIT: doInit,
  MINE: doMine,
  SYNC: doSync,
  VALIDATE: doValidate,
};

export const handleTask = async (): Promise<void> => {
  const operation: string | undefined = process.env.OPERATION;

  if (operation === undefined) {
    throw new Error(
      `unable to handle task because the OPERATION environment variable was not set`
    );
  }

  const operationFn: () => Promise<void> | undefined = operationMap[operation];

  if (operationFn === undefined) {
    throw new Error(
      `unable to handle task because the operation passed: ${operation} should be one of ${_.keys(
        operationMap
      )}`
    );
  }

  await operationFn();
};
