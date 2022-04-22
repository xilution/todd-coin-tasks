import { blockUtils } from "@xilution/todd-coin-utils";
import {
  blocksBroker,
  transactionsBroker,
  environmentUtils,
} from "@xilution/todd-coin-brokers";
import { DbClient } from "@xilution/todd-coin-brokers";
import { DatabaseSettings } from "@xilution/todd-coin-brokers/src/types";
import {
  MAX_TRANSACTIONS_PER_BLOCK,
  MAXIMUM_PAGE_SIZE,
} from "@xilution/todd-coin-constants";
import _ from "lodash";
import { Block } from "@xilution/todd-coin-types";
import { getMiningSettings } from "./environment-utils";

const getDbClient = async (): Promise<DbClient> => {
  const databaseSettings: DatabaseSettings =
    environmentUtils.getDatabaseSettings();
  const { database, username, password, dbHost, dbPort } = databaseSettings;
  const dbClient: DbClient = new DbClient();

  await dbClient.init(database, username, password, dbHost, dbPort);

  return dbClient;
};

export const doMine = async (): Promise<void> => {
  const dbClient: DbClient = await getDbClient();

  const latestBlock: Block | undefined = await blocksBroker.getLatestBlock(
    dbClient
  );

  if (latestBlock === undefined) {
    console.log(`unable to mine because the latest block was undefined`);
    return;
  }

  const pageNumber = 0;
  const pageSize = _.min([
    MAX_TRANSACTIONS_PER_BLOCK,
    MAXIMUM_PAGE_SIZE,
  ]) as number;

  const { rows } = await transactionsBroker.getSignedTransactions(
    dbClient,
    pageNumber,
    pageSize
  );

  if (rows.length === 0) {
    console.log("unable to mine because there are no signed transactions");
    return;
  }

  const newBlock: Block = await blockUtils.mineNewBlock(latestBlock, rows);

  const { minerPublicKey } = getMiningSettings();

  await blocksBroker.createBlock(dbClient, newBlock, minerPublicKey);
};

export const doSync = async (): Promise<void> => {
  throw new Error("not implemented yet");
};
