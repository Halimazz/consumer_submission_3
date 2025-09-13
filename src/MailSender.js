import nodemailer from "nodemailer"

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // biasanya pakai false, kalau pakai TLS bisa true (port 465)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(targetEmail, content) {
    const message = {
      from: process.env.SMTP_USER,
      to: targetEmail,
      subject: "Ekspor Lagu Playlist",
      text: "Terlampir hasil dari ekspor lagu playlist Anda",
      attachments: [
        {
          filename: "playlist.json",
          content, // langsung isi buffer/string json
        },
      ],
    };

    const info = await this._transporter.sendMail(message);
    return info;
  }
}

export default MailSender;