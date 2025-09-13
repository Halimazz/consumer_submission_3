class Listener {
  constructor(songService, mailSender) {
    this._songService = songService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      // Ambil data playlist dari SongService
      const playlist = await this._songService.getSongsFromPlaylist(playlistId);

      // Ubah data ke JSON string
      const result = JSON.stringify(playlist);

      // Kirim email dengan MailSender
      await this._mailSender.sendEmail(targetEmail, result);

      console.log(`Playlist ${playlistId} berhasil diekspor ke ${targetEmail}`);
    } catch (error) {
      console.error("Gagal memproses pesan:", error);
    }
  }
}

export default Listener;
