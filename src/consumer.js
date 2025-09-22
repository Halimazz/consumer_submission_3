import "dotenv/config";
import amqp from "amqplib";
import SongService from "./SongService.js";
import MailSender from "./MailSender.js";
import Listener from "./Listener.js";

const init = async () => {
  const songService = new SongService();
  const mailSender = new MailSender();
  const listener = new Listener(songService, mailSender);

  try {
    // Koneksi ke RabbitMQ pakai env RABBITMQ_SERVER
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    const queue = "export:playlists";
    await channel.assertQueue(queue, {
      durable: true,
    });

    console.log(`Consumer aktif. Menunggu pesan dari queue: ${queue}`);

    // Terima pesan
    channel.consume(queue, listener.listen, { noAck: true });
  } catch (error) {
    console.error("Gagal menjalankan consumer:", error);
  }
};

init();
