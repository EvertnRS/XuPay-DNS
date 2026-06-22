import { prismaClient } from "./prismaClient";


async function main() {
  await prismaClient.dNSRecord.createMany({
    data: [
      { domain: "PAYMENT-HOST-1", ip: process.env.PAYMENT_HOST_1 || "" },
      { domain: "PAYMENT-HOST-2", ip: process.env.PAYMENT_HOST_2 || "" },
      { domain: "PAYMENT-HOST-3", ip: process.env.PAYMENT_HOST_3 || "" },

      { domain: "HISTORY-HOST-1", ip: process.env.HISTORY_HOST_1 || "" },
      { domain: "HISTORY-HOST-2", ip: process.env.HISTORY_HOST_2 || "" },
      { domain: "HISTORY-HOST-3", ip: process.env.HISTORY_HOST_3 || "" },

      { domain: "PROCESSING-HOST-1", ip: process.env.PROCESSING_HOST_1 || "" },
      { domain: "PROCESSING-HOST-2", ip: process.env.PROCESSING_HOST_2 || "" },
      { domain: "PROCESSING-HOST-3", ip: process.env.PROCESSING_HOST_3 || "" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prismaClient.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });