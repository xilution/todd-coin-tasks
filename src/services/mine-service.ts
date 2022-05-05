import {
  blocksBroker,
  DbClient,
  transactionsBroker,
} from "@xilution/todd-coin-brokers";
import { Block } from "@xilution/todd-coin-types";
import _ from "lodash";
import {
  MAX_TRANSACTIONS_PER_BLOCK,
  MAXIMUM_PAGE_SIZE,
} from "@xilution/todd-coin-constants";
import { blockUtils } from "@xilution/todd-coin-utils";
import { getMiningSettings } from "../environment-utils";
import { getDbClient } from "./db-utils";
import dayjs from "dayjs";

export default async () => {
  const now = dayjs();
  const dbClient: DbClient = await getDbClient();

  const latestBlock: Block | undefined = await blocksBroker.getLatestBlock(
    dbClient
  );

  if (latestBlock === undefined) {
    console.log(`Unable to mine because the latest block was undefined`);
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
    console.log("Unable to mine because there are no signed transactions");
    return;
  }

  const newBlock: Block = await blockUtils.mineNewBlock(latestBlock, rows);

  const { minerParticipantId } = getMiningSettings();

  await blocksBroker.createBlock(dbClient, newBlock, minerParticipantId);

  const duration = dayjs().diff(now);

  console.log(`All Done! Mining took ${duration} ms.`); // todo - log metrics to Prometheus

  await dbClient.sequelize?.close();
};
