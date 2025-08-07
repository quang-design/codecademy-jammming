import { SearchContent, Track } from "spotify-types";
import type { TrackProps } from "../components/Track";

class Spotify {
  private accessToken: string | null = null;
  private tokenExpirationTime: number | null = null;

  private isTokenExpired() {
    if (!this.tokenExpirationTime) return true;
    return Date.now() > this.tokenExpirationTime;
  }

  public async getAccessToken() {
    if (this.accessToken && !this.isTokenExpired()) {
      return this.accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      });

      const data: { access_token: string; expires_in: number } =
        await response.json();
      this.accessToken = data.access_token;
      this.tokenExpirationTime = Date.now() + data.expires_in * 1000;

      return this.accessToken;
    } catch (error) {
      console.error("Error getting Spotify access token:", error);
      throw error;
    }
  }

  public async searchTracks(query: string) {
    const accessToken = await this.getAccessToken();

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data: SearchContent = await response.json();

      const tracks: Track[] = data?.tracks?.items || [];

      const parsedTracks: TrackProps[] = tracks.map((track) => ({
        id: track.id,
        cover: track.album.images[0].url,
        title: track.name,
        artist: track.artists[0].name,
        href: track.external_urls.spotify,
      }));

      return parsedTracks;
    } catch (error) {
      console.error("Error getting Spotify track:", error);
      throw error;
    }
  }

  public async getCurrentUserProfile() {
    const accessToken = await this.getAccessToken();

    try {
      const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting current user profile:", error);
      throw error;
    }
  }
}

// Export a singleton instance
const spotify = new Spotify();
export default spotify;
