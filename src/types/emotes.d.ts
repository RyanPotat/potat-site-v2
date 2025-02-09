export interface Emote {
  readonly id: string;
  readonly name: string;
  readonly format: string;
  readonly url: string;
}

export interface EmoteInfo {
  readonly channelID: string;
  readonly channelLogin: string;
  readonly channelName: string;
  readonly emoteID: string;
  readonly emoteCode: string;
  readonly emotePrefix: string;
  readonly emoteSuffix: string;
  readonly emoteURL: string;
  readonly emoteSetID: string;
  readonly emoteAssetType: string;
  readonly emoteState: string;
  readonly emoteType: string;
  readonly emoteTier: number;
  readonly bitCost: number;
  readonly artist?: {
    readonly id: string;
    readonly login: string;
    readonly displayName: string;
  }
}

export interface SearchOptions {
  readonly approach: 'matches' | 'starts' | 'includes' | 'ends';
  readonly format: 'static' | 'animated' | 'any';
  readonly case: boolean;
  readonly cursor: string | null;
}

export interface SimpleChannel {
  readonly pfp: string;
  readonly bestName: string;
  readonly login: string;
  readonly name: string;
}

export interface EmoteHistoryEntry {
  readonly set_id: string;
  readonly provider: string;
  readonly action: string;
  readonly emote_id: string;
  readonly emote_name: string;
  readonly emote_alias: string;
  readonly emote_new_alias: null;
  readonly actor: 'potatbotat' | 'external';
  readonly user_login: string;
  readonly user_name: string;
  readonly user_ffz_id: string;
  readonly user_bttv_id: string;
  readonly user_stv_id: string;
  readonly known_bot: boolean;
  readonly bestUserName: string;
  readonly set_name: string;
  readonly user_color: string;
  readonly ago: string;
  readonly user_stv_pfp: string;
  readonly user_pfp: string;
  readonly emoteURL: string;
  readonly emoteLink: string;
  readonly expires_at: string | null;
  readonly is_expired: boolean;
  readonly type: string;
}

export interface ComputedExtras extends EmoteHistoryEntry {
  readonly user_url: string;
  readonly set_url: string;
  readonly method: string;
  readonly word: string;
  readonly expiry: string | null;
}

export interface HistoryResponse {
  readonly channel: Channel;
  readonly history: EmoteHistory[];
}
