import {
  blocksBroker,
  DbClient,
  participantsBroker,
  transactionsBroker,
} from "../../../todd-coin-brokers";
import { getInitSettings } from "../environment-utils";
import {
  Block,
  Participant,
  PendingTransaction,
  TransactionDetails,
} from "@xilution/todd-coin-types";
import { genesisUtils } from "@xilution/todd-coin-utils";
import { createDatabase, getDbClient } from "./db-utils";
import dayjs from "dayjs";

export default async () => {
  const now = dayjs();
  await createDatabase();

  const dbClient: DbClient = await getDbClient();

  const { genesisFirstName, genesisLastName, genesisEmail, genesisPassword } =
    getInitSettings();

  const genesisParticipant: Participant = genesisUtils.createGenesisParticipant(
    genesisFirstName,
    genesisLastName,
    genesisEmail,
    genesisPassword
  );

  console.log(
    `Created genesis participant: ${JSON.stringify(genesisParticipant)}`
  );
  console.log(
    `Please change the genesis user's password and generate a new participant key ASAP!`
  );

  await participantsBroker.createParticipant(dbClient, genesisParticipant);

  const genesisBlock: Block =
    genesisUtils.createGenesisBlock(genesisParticipant);

  await Promise.all(
    genesisBlock.transactions.map(
      async (
        genesisTransaction: PendingTransaction<TransactionDetails> & {
          goodPoints: number;
        }
      ) => {
        const pendingTransaction:
          | PendingTransaction<TransactionDetails>
          | undefined = await transactionsBroker.createPendingTransaction(
          dbClient,
          genesisTransaction
        );
        if (pendingTransaction !== undefined) {
          await transactionsBroker.createSignedTransaction(dbClient, {
            ...pendingTransaction,
            goodPoints: genesisTransaction.goodPoints,
          });
        }
      }
    )
  );

  const genesisParticipantId = genesisParticipant.id as string;

  await blocksBroker.createBlock(dbClient, genesisBlock, genesisParticipantId);

  const duration = dayjs().diff(now);

  console.log(`All Done!. Initialization took ${duration} ms.`); // todo - log metrics to Prometheus

  await dbClient.sequelize?.close();
};
