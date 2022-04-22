import { doMine, doSync } from "./operations";
import _ from "lodash";

const operationMap: { [operation: string]: () => Promise<void> } = {
  MINE: doMine,
  SYNC: doSync,
};

export const handleTask = async (): Promise<void> => {
  const operation: string | undefined = process.env.OPERATION;

  if (operation === undefined) {
    throw new Error(
      `unable to handle task b/c the OPERATION environment variable was not set`
    );
  }

  const operationFn: () => Promise<void> | undefined = operationMap[operation];

  if (operationFn === undefined) {
    throw new Error(
      `unable to handle task b/c the operation passed: ${operation} should be one of ${_.keys(
        operationMap
      )}`
    );
  }

  await operationFn();
};
