export interface SearchTracksArgs {
  query: string;
  limit?: number;
}

export interface CreatePlaylistArgs {
  name: string;
  description: string;
  tracks: string[];
}

export interface TrackData {
  id: string;
  name: string;
  artists: string[];
  album: string;
  uri: string;
}

export interface PlaylistData {
  id: string;
  name: string;
  description: string;
  tracks: TrackData[];
  url: string;
}

// Type guards
export function isValidSearchArgs(args: any): args is SearchTracksArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    typeof args.query === "string" &&
    (args.limit === undefined || typeof args.limit === "number")
  );
}

export function isValidPlaylistArgs(args: unknown): args is CreatePlaylistArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as CreatePlaylistArgs).name === 'string' &&
    'description' in args &&
    typeof (args as CreatePlaylistArgs).description === 'string' &&
    'tracks' in args &&
    Array.isArray((args as CreatePlaylistArgs).tracks) &&
    (args as CreatePlaylistArgs).tracks.every(track => typeof track === 'string')
  );
} 