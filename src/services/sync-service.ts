import dayjs from "dayjs";

export default async () => {
  const now = dayjs();

  // todo - sync blocks
  // todo - sync nodes
  // todo - sync organization
  // todo - sync participants
  // todo - sync organization-participant references
  // todo - sync transactions?

  // question - what does this do that the node callbacks don't?

  const duration = dayjs().diff(now);
  console.log(`All Done! Sync took ${duration} ms.`); // todo - log metrics to Prometheus
  throw new Error("Not implemented yet");
};
