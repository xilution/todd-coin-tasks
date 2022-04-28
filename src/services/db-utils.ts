import {
  DatabaseSettings,
  DbClient,
  environmentUtils,
} from "@xilution/todd-coin-brokers";
import { Client } from "pg";

export const createDatabase = async (): Promise<void> => {
  const databaseSettings: DatabaseSettings =
    environmentUtils.getDatabaseSettings();
  const { database, username, password, dbHost, dbPort } = databaseSettings;

  let client;
  try {
    client = new Client({
      user: username,
      password,
      host: dbHost,
      port: dbPort,
    });
    await client.connect();
    await client.query(`CREATE DATABASE "${database}"`);
  } catch (error) {
    console.log(
      `unable to create new database ${database} because ${
        (error as Error).message
      }`
    );
  } finally {
    await client?.end();
  }
};

export const getDbClient = async (): Promise<DbClient> => {
  const databaseSettings: DatabaseSettings =
    environmentUtils.getDatabaseSettings();
  const { database, username, password, dbHost, dbPort } = databaseSettings;
  const dbClient: DbClient = new DbClient();

  await dbClient.init(database, username, password, dbHost, dbPort);

  return dbClient;
};
