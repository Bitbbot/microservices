import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import CertificateService from "./certificate.service.js";
import * as dotenv from "dotenv";
dotenv.config();

export async function run() {
  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [`${process.env.BROKER_URL}`],
  });

  const consumer: Consumer = kafka.consumer({
    groupId: `${process.env.KAFKA_CONSUMER_GROUP_ID}`,
  });

  await consumer.connect();
  await consumer.subscribe({
    topic: "delete_certificate",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      console.log("here");
      if (message.value?.toString()) {
        const { supplierId, fileIds } = JSON.parse(message.value?.toString());
        if (fileIds.length === 0)
          CertificateService.deleteBySupplierId(supplierId);
        else CertificateService.delete(supplierId, fileIds);
      }
      console.log("deleted");
    },
  });
}

run().catch(console.error);
