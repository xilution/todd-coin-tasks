import { MiningSettings } from "./types";
import { GENESIS_PARTICIPANT_PUBLIC_KEY } from "@xilution/todd-coin-constants";

const DEFAULT_MINER_PUBLIC_KEY = GENESIS_PARTICIPANT_PUBLIC_KEY;

export const getMiningSettings = (): MiningSettings => {
  const minerPublicKey =
    process.env.MINER_PUBLIC_KEY || DEFAULT_MINER_PUBLIC_KEY;

  return { minerPublicKey };
};
