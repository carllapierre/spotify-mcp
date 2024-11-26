import SpotifyWebApi from 'spotify-web-api-node';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Add debugging
console.log('Environment variables loaded:', {
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID ? '✓' : '✗',
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ? '✓' : '✗',
  SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI ? '✓' : '✗'
});

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
  throw new Error("Missing required Spotify credentials in .env file");
}

const app = express();
const scopes = ['playlist-modify-private', 'playlist-modify-public'];
const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUri: SPOTIFY_REDIRECT_URI
});

app.get('/login', (req, res) => {
  const state = 'state-value';
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code as string);
    console.log('Refresh token:', data.body.refresh_token);
    res.send('Check your console for the refresh token!');
  } catch (err) {
    console.error('Error getting token:', err);
    res.send('Error getting token');
  }
});

app.listen(8888, () => {
  console.log('Server running on http://localhost:8888');
  console.log('Visit http://localhost:8888/login to get your refresh token');
}); 