import {
  blocksBroker,
  DbClient, organizationsBroker,
  participantKeysBroker,
  participantsBroker,
  transactionsBroker,
} from "@xilution/todd-coin-brokers";
import { getInitSettings } from "../environment-utils";
import {
  Block, Organization,
  Participant,
  ParticipantKey,
  PendingTransaction,
  SignedTransaction,
  TransactionDetails,
} from "@xilution/todd-coin-types";
import {
  genesisUtils,
  transactionUtils,
} from "@xilution/todd-coin-utils";
import { createDatabase, getDbClient } from "./db-utils";
import dayjs from "dayjs";

export default async () => {
  const now = dayjs();
  await createDatabase();

  const dbClient: DbClient = await getDbClient();

  const { genesisFirstName, genesisLastName, genesisEmail, genesisPassword } =
    getInitSettings();

  const toddCoinOrganization: Organization = genesisUtils.createToddCoinOrganization();

  const createdOrganization: Organization | undefined = await organizationsBroker.createOrganization(dbClient, toddCoinOrganization);

  if (createdOrganization === undefined) {
    throw new Error("init failed because unable to create the Todd Coin organization");
  }

  const genesisParticipant: Participant = genesisUtils.createGenesisParticipant(
    genesisFirstName,
    genesisLastName,
    genesisEmail,
    genesisPassword
  );

  console.log(
    `Created genesis participant: ${JSON.stringify(genesisParticipant)}`
  );

  const genesisParticipantKey: ParticipantKey =
    genesisUtils.createGenesisParticipantKey();

  console.log(
    `Created genesis participant key: ${JSON.stringify(genesisParticipantKey)}`
  );

  console.log(
    `Please change the genesis user's password and generate a new participant key ASAP!`
  );

  const createdParticipant: Participant | undefined = await participantsBroker.createParticipant(dbClient, genesisParticipant);

  if (createdParticipant === undefined) {
    throw new Error("init failed because unable to create the genesis participant");
  }

  const createdParticipantKey: ParticipantKey | undefined = await participantKeysBroker.createParticipantKey(
    dbClient,
    genesisParticipant,
    genesisParticipantKey
  );

  if (createdParticipantKey === undefined) {
    throw new Error("init failed because unable to create the genesis participant key");
  }

  const genesisBlock: Block = genesisUtils.createGenesisBlock(
    genesisParticipant,
    genesisParticipant,
    genesisParticipantKey,
    genesisParticipantKey.private as string
  );

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
          const signedTransaction: SignedTransaction<TransactionDetails> =
            transactionUtils.signTransaction(
              pendingTransaction,
              genesisTransaction.goodPoints,
              createdParticipantKey,
              genesisParticipantKey.private as string
            );

          await transactionsBroker.createSignedTransaction(
            dbClient,
            signedTransaction
          );
        }
      }
    )
  );

  const genesisParticipantId = createdParticipant.id as string;

  await blocksBroker.createBlock(dbClient, genesisBlock, genesisParticipantId);

  const duration = dayjs().diff(now);

  console.log(`All Done!. Initialization took ${duration} ms.`); // todo - log metrics to Prometheus

  await dbClient.sequelize?.close();
};
