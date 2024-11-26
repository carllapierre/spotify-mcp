# SpotifyMCP MCP Server

This is a TypeScript-based MCP server for Spotify.

## Features

### Tools
- `create_playlist` - Create a new Spotify playlist.
  - Takes name, description, tracks, and public status as parameters.
  - Returns the URI of the created playlist.

### Prompts
- `search_songs` - Search for songs on Spotify.
  - Takes a search query and an optional limit for results.

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "SpotifyMCP": {
      "command": "node",
      "args": [
        "/Users/your_username/Documents/SideProjects/MCPs/spotify-mcp/build/index.js"
      ],
      "env": {
        "SPOTIFY_CLIENT_ID": "your_client_id_here",
        "SPOTIFY_CLIENT_SECRET": "your_client_secret_here",
        "SPOTIFY_REFRESH_TOKEN": "your_refresh_token_here"
      }
    },
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## Setup Instructions

1. **Create a Spotify Developer Account**  
   Visit [Spotify Developer](https://developer.spotify.com/) and create an account.

2. **Create a New Application**  
   After logging in, create a new application to obtain your **Client ID** and **Client Secret**.

3. **Set Up Redirect URI**  
   In your Spotify application settings, configure the redirect URI to:  
   ```
   http://localhost:8888/callback
   ```

4. **Create a `.env` File**  
   In the root of your project, create a `.env` file and add the following environment variables:
   ```plaintext
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
   ```

5. **Get Your Spotify Token**  
   Run the following command to obtain your Spotify token:
   ```bash
   npx ts-node src/scripts/get-spotify-token.ts
   ```

6. **Login to Your Application**  
   Visit http://localhost:8888/login in your browser
   Copy the refresh token and set it in your environment variables:
   SPOTIFY_REFRESH_TOKEN=your_refresh_token_here