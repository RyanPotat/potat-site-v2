export interface Emote {
  id: string;
  name: string;
  format: string;
  url: string;
}

export interface EmoteInfo {
  channelID: string;
  channelLogin: string;
  channelName: string;
  emoteID: string;
  emoteCode: string;
  emotePrefix: string;
  emoteSuffix: string;
  emoteURL: string;
  emoteSetID: string;
  emoteAssetType: string;
  emoteState: string;
  emoteType: string;
  emoteTier: number;
  bitCost: number;
  artist?: {
    id: string;
    login: string;
    displayName: string;
  }
}

export interface SearchOptions {
  approach: 'matches' | 'starts' | 'includes' | 'ends';
  format: 'static' | 'animated' | 'any';
  case: boolean;
  cursor: string | null;
}

export interface Channel {
  pfp:      string;
  bestName: string;
  login:    string;
  name:     string;
}

export interface EmoteHistory {
  set_id:          string;
  action:          "ADD" | "REMOVE" | "ALIAS";
  emote_id:        string;
  emote_name:      string;
  emote_alias:     null;
  emote_new_alias: null;
  provider:        "STV" | "FFZ" | "BTTV" | "7TV";
  user_login:      string;
  user_name:       string;
  user_ffz_id:     number;
  user_bttv_id:    string;
  user_stv_id:     string;
  bestUserName:    string;
  set_name:        string;
  user_color:      string;
  ago:             string;
  user_stv_pfp:    string;
  user_pfp:        string;
  emoteURL:        string;
  emoteLink:       string;
  actor:           'potatbotat' | 'external';
  known_bot:       boolean;
  expires_at:      string | null;
  is_expired:      boolean;
}

export interface ComputedExtras extends EmoteHistory {
  user_url: string;
  set_url: string;
  method: string;
  word: string;
  expiry: string | null;
}

export interface HistoryResponse {
  channel: Channel;
  history: EmoteHistory[];
}
