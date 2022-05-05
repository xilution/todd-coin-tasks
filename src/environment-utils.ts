import { InitSettings, MiningSettings } from "./types";

const DEFAULT_GENESIS_FIRST_NAME = "John";
const DEFAULT_GENESIS_LAST_NAME = "Doe";
const DEFAULT_GENESIS_EMAIL = "jdoe@example.com";
const DEFAULT_GENESIS_PASSWORD = "secret";

export const getInitSettings = (): InitSettings => {
  const genesisFirstName =
    process.env.GENESIS_FIRST_NAME || DEFAULT_GENESIS_FIRST_NAME;
  const genesisLastName =
    process.env.GENESIS_LAST_NAME || DEFAULT_GENESIS_LAST_NAME;
  const genesisEmail = process.env.GENESIS_EMAIL || DEFAULT_GENESIS_EMAIL;
  const genesisPassword =
    process.env.GENESIS_PASSWORD || DEFAULT_GENESIS_PASSWORD;

  return {
    genesisFirstName,
    genesisLastName,
    genesisEmail,
    genesisPassword,
  };
};

export const getMiningSettings = (): MiningSettings => {
  const minerParticipantId = process.env.MINER_PARTICIPANT_ID;

  return { minerParticipantId };
};
