// src/services/postgres/SongsService.js
import { Pool } from "pg";

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsFromPlaylist(playlistId) {
    // ambil detail playlist
    const playlistQuery = {
      text: "SELECT id, name FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rowCount) {
      throw new Error("Playlist not found");
    }

    // ambil lagu-lagu di playlist
    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
             FROM songs
             INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    return {
      playlist: {
        id: playlistResult.rows[0].id,
        name: playlistResult.rows[0].name,
        songs: songsResult.rows,
      },
    };
  }
}

export default SongService;
