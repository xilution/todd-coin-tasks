export const handler = (): void => {
  const operation = process.env.OPERATION;

  console.log(`Operation: ${operation}`);
};

handler();
