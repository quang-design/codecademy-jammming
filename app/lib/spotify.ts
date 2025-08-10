import { SearchContent, Track } from "spotify-types";
import type { TrackProps } from "../components/Track";

class Spotify {
  private accessToken: string | null = null;
  private tokenExpirationTime: number | null = null;

  private isTokenExpired() {
    if (!this.tokenExpirationTime) return true;
    return Date.now() > this.tokenExpirationTime;
  }

  public setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
    this.tokenExpirationTime = Date.now() + 60 * 60 * 1000;
  }

  public async getAccessToken() {
    if (this.accessToken && !this.isTokenExpired()) {
      return this.accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing Spotify credentials");
    }

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
    try {
      const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting current user profile:", error);
      throw error;
    }
  }

  public async createPlaylist(userId: string, playlistName: string) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playlistName,
            public: false,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Spotify API error creating playlist:", errorData);
        throw new Error(
          `Failed to create playlist: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Playlist creation response:", data);

      if (!data.id) {
        console.error("No playlist ID in response:", data);
        throw new Error("No playlist ID returned from Spotify API");
      }

      return data.id;
    } catch (error) {
      console.error("Error creating playlist:", error);
      throw error;
    }
  }

  public async addItemsToPlaylist(playlistId: string, tracks: TrackProps[]) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: tracks.map((track) => `spotify:track:${track.id}`),
            position: 0,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Spotify API error adding tracks:", errorData);
        throw new Error(
          `Failed to add tracks: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Add tracks response:", data);

      if (!data.snapshot_id) {
        console.error("No snapshot_id in response:", data);
        throw new Error("No snapshot_id returned from Spotify API");
      }

      return { snapshot_id: data.snapshot_id };
    } catch (error) {
      console.error("Error adding items to playlist:", error);
      throw error;
    }
  }
}

// Export a singleton instance
const spotify = new Spotify();
export default spotify;
