import axios from "axios";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const getSpotifyToken = async (): Promise<string | null> => {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  console.log(clientId)
  console.log(clientSecret)
  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            btoa(`${clientId}:${clientSecret}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error("Error fetching Spotify token:", error);
    return null;
  }
};

export default getSpotifyToken;
