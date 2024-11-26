#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError
} from "@modelcontextprotocol/sdk/types.js";
import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Spotify API with credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Set the refresh token
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
if (refreshToken) {
  spotifyApi.setRefreshToken(refreshToken);
} else {
  throw new Error("SPOTIFY_REFRESH_TOKEN is not defined in the environment variables.");
}

// Initialize the MCP server
const mcpServer = new Server({
  name: "spotify-mcp-server",
  version: "0.1.0"
}, {
  capabilities: {
    tools: {}
  }
});

// MCP Tool Handlers
mcpServer.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools: [{
      name: "search_songs",
      description: "Search for songs on Spotify",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query (song name, artist, etc.)"
          },
          limit: {
            type: "number",
            description: "Maximum number of results (1-50)",
            minimum: 1,
            maximum: 50
          }
        },
        required: ["query"]
      }
    },
    {
      name: "create_playlist",
      description: "Create a new Spotify playlist and return the URI to ALWAYS present to the user as a hyperlink",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the playlist"
          },
          description: {
            type: "string",
            description: "Description of the playlist"
          },
          tracks: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Array of Spotify track URIs"
          },
          public: {
            type: "boolean",
            description: "Whether the playlist should be public",
            default: false
          }
        },
        required: ["name", "tracks"]
      }
    }]
  })
);

mcpServer.setRequestHandler(
  CallToolRequestSchema,
  async (request) => {
    await ensureValidToken();

    switch (request.params.name) {
      case "search_songs":
        return await handleSearchSongs(request.params.arguments);
      case "create_playlist":
        return await handleCreatePlaylist(request.params.arguments);
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
    }
  }
);

async function ensureValidToken(): Promise<void> {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body['access_token']);
  } catch (error) {
    throw new McpError(ErrorCode.InternalError, 'Failed to refresh access token');
  }
}

async function handleSearchSongs(args: any): Promise<any> {
  try {
    const data = await spotifyApi.searchTracks(args.query, { limit: args.limit || 10 });
    const tracks = data.body.tracks?.items.map((track: any) => ({
      name: track.name,
      artists: track.artists.map((artist: any) => artist.name).join(', '),
      uri: track.uri
    }));

    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(tracks, null, 2)
            }
        ]
    };
  } catch (error: any) {
    throw new McpError(ErrorCode.InternalError, `Spotify API error: ${error.message}`);
  }
}

async function handleCreatePlaylist(args: any): Promise<any> {
  try {

    const playlistData = await spotifyApi.createPlaylist( args.name, {
        description: args.description || '',
        collaborative: false, // Add this property if needed
        public: args.public // Ensure this is correctly set
      });

    await spotifyApi.addTracksToPlaylist(playlistData.body.id, args.tracks);

    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    playlist_url: playlistData.body.external_urls.spotify
                }, null, 2)
            }
        ]
    };
  } catch (error: any) {
    throw new McpError(ErrorCode.InternalError, `Failed to create playlist: ${error.message}`);
  }
}

// Run the MCP server
const transport = new StdioServerTransport();
mcpServer.connect(transport).catch(console.error);