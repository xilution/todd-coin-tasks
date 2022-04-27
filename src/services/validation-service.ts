import { blocksBroker, DbClient } from "../../../todd-coin-brokers";
import { getDbClient } from "./db-utils";
import { DEFAULT_PAGE_SIZE } from "@xilution/todd-coin-constants";
import { blockchainUtils } from "@xilution/todd-coin-utils";
import dayjs from "dayjs";

export default async () => {
  const now = dayjs();
  const dbClient: DbClient = await getDbClient();
  let done = false;
  let pageNumber = 0;
  const pageSize = DEFAULT_PAGE_SIZE;

  while (!done) {
    const { rows } = await blocksBroker.getBlocks(
      dbClient,
      pageNumber,
      pageSize
    );

    const valid = blockchainUtils.isChainValid(rows);

    if (!valid) {
      throw new Error(
        `Found invalid blocks at page ${pageNumber}. Used page size: ${pageSize}.`
      );
    }

    if (rows.length === 0) {
      done = true;
    }

    pageNumber = pageNumber + 1;
  }

  const duration = dayjs().diff(now);

  console.log(`Everything looks great! Validation took ${duration} ms.`); // todo - log metrics to Prometheus

  await dbClient.sequelize?.close();
};
