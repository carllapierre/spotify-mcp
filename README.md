# SpotifyMCP MCP Server

Context Protocol Server for Spotify

This is a TypeScript-based MCP server that implements a simple notes system. It demonstrates core MCP concepts by providing:

- Resources representing text notes with URIs and metadata
- Tools for creating new notes
- Prompts for generating summaries of notes

## Features

### Resources
- List and access notes via `note://` URIs
- Each note has a title, content and metadata
- Plain text mime type for simple content access

### Tools
- `create_note` - Create new text notes
  - Takes title and content as required parameters
  - Stores note in server state

### Prompts
- `summarize_notes` - Generate a summary of all stored notes
  - Includes all note contents as embedded resources
  - Returns structured prompt for LLM summarization

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
        "/Users/carl.lapierre/Documents/SideProjects/MCPs/spotify-mcp/build/index.js"
      ],
      "env": {
        "SPOTIFY_CLIENT_ID": "your_client_id_here",
        "SPOTIFY_CLIENT_SECRET": "your_client_secret_here"
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





Create a Spotify Developer account at https://developer.spotify.com/
Create a new application to get your Client ID and Client Secret
Set up the redirect URI in your Spotify application settings
Let me know when you've completed these steps and I'll help you with the next part!


npx ts-node get-spotify-token.ts
Visit http://localhost:8888/login in your browser
Copy the refresh token and set it in your environment variables:
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here