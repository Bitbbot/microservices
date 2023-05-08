import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import CertificateService from "./certificate.service.js";

export async function run() {
  const kafka = new Kafka({
    clientId: "1",
    brokers: ["localhost:29092"],
  });

  const consumer: Consumer = kafka.consumer({ groupId: "1" });

  await consumer.connect();
  await consumer.subscribe({
    topic: "delete_certificate",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
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
