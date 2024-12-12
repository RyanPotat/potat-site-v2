export interface UserState {
  id: string;
  login: string;
  name: string;
  stv_id: string;
  is_channel: boolean;
}

export interface TokenUserData {
  token: string;
  user: string;
}

export interface ColorStop {
  color: number;
  at: number;
}

export interface Shadow {
  color: number;
  x_offset: number;
  y_offset: number;
  radius: number;
}

export type Callback<T = any> = (...args: T[]) => void;

export interface TwitchUser {
  chatColor: string | null;
  userPaint: Paint | null;
  stv_pfp: string | null;
  twitch_pfp: string | null;
  name: string | null;
}

export interface Partner {
  username: string;
  display: string;
  stv_pfp: string;
  twitch_pfp: string;
  page_url: string;
  followers: number;
  joined_at: string;
  command_count: number;
  user_color: string;
}

export interface UpdateEvent {
  data: any;
  topic: string;
}
