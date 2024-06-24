<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export interface HistoryResponse {
    channel: Channel;
    history: EmoteHistory[];
}

export interface Channel {
    pfp:      string;
    bestName: string;
    login:    string;
    name:     string;
}

export interface EmoteHistory {
    set_id:          string;
    platform:        string;
    action:          string;
    emote_id:        string;
    emote_name:      string;
    emote_alias:     null;
    emote_new_alias: null;
    provider:        string;
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
}

interface ComputedExtras extends EmoteHistory {
  user_url: string;
  set_url: string;
  method: string;
  word: string;
}

const route = useRoute();
const username = ref(route.params.username);

const limit = ref(route.query.limit ?? 50);
const history = ref<ComputedExtras[]>([]);
const channel = ref<Channel>({
  pfp: '',
  bestName: '',
  login: '',
  name: ''
});

const fetchEmoteHistory = async () => {
  try {
    const data: HistoryResponse = await fetch(
      `https://api.potat.app/emotes/history/${username.value}${limit ? `?limit=${limit.value}` : ''}`
    )
      .then(res => res.json())
      .then(res => res.data[0]);

    channel.value = data.channel;

    history.value = data.history.map(update => {
      let userPfp: string = update.user_stv_pfp;
      let user_url: string = '';
      let set_url: string = '';
      let method: string = '';
      let word: string = '';

      if (!update.user_stv_pfp || update.user_stv_pfp === '//cdn.7tv.app/') {
        userPfp = update.user_pfp;
      }

      if (update.action === 'ALIAS') {
        method = `renamed ${update.emote_name} to `;
        word = 'in';
      }
      if (update.action === 'ADD') {
        method = `added `;
        word = 'to';
      }
      if (update.action === 'REMOVE') {
        method = `removed `;
        word = 'from';
      }

      if (update.provider === '7TV' || update.provider === 'STV') {
        user_url = `https://7tv.app/users/${update.user_stv_id}`;
        set_url = `https://7tv.app/emote-sets/${update.set_id}`;
      }
      if (update.provider === 'BTTV') {
        user_url = `https://betterttv.com/users/${update.user_bttv_id}`;
        set_url = `https://betterttv.com/users/${update.set_id}`;
      }
      if (update.provider === 'FFZ') {
        user_url = `https://www.frankerfacez.com/channel/${update.user_login}`;
        set_url = `https://www.frankerfacez.com/channel/${channel.value.login}`;
      }

      return {
        ...update,
        user_pfp: userPfp,
        user_url,
        set_url,
        method,
        word
      }

    });
  } catch (error) {
    console.error('Failed to fetch emote history:', error);
  }
};

onMounted(() => {
  fetchEmoteHistory();
});
</script>

<template>
  <div id="container">
    <div class="profile-container">
      <div class="title-content">
        <div class="profile-picture">
          <a :href="`https://twitch.tv/${channel.login}`" target="_blank">
            <img :src="channel.pfp" :alt="`${channel.bestName} profile picture`" width="50" height="50" />
          </a>
        </div>
        <h2>Last {{ limit }} emote actions by PotatBotat for {{ channel.bestName }}'s channel</h2>
      </div>
    </div>
    <ul class="emote-list">
      <li v-for="update in history" :key="update.emote_id" class="emote-item">
        <div class="profile-picture">
          <a :href="`https://twitch.tv/${update.user_login}`" target="_blank">
            <img :src="update.user_stv_pfp || update.user_pfp" :alt="`${update.user_name} profile picture`" />
          </a>
        </div>
        <div class="text-content">
          ({{ update.provider.replace('STV', '7TV') }})
          <a :href="update.user_url" target="_blank">
            <strong :style="{ color: update.user_color }">{{ update.user_name }}</strong> 
          </a> 
          {{ update.method }}
          <span>
            <a :href="update.emoteLink" target="_blank">
              <img :src="update.emoteURL" />
            </a>
            {{ update.emote_alias || update.emote_name }}
          </span>
          {{ update.word }} set 
          <a :href="update.set_url" target="_blank">
            <em>"{{ update.set_name }}"</em>
          </a>
          {{ update.ago }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  line-height: 1.5;
  background-color: #3d3d3d;
}

#container {
  max-height: 93vh;
  width: 95%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  color: #e5e4e4;
}

.profile-container {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: rgba(31, 31, 31, 0.94);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.profile-picture img {
  border-radius: 50%;
  margin-right: 1rem;
  width: 50px;
  height: 50px;
}

.title-content {
  display: flex;
  align-items: center;
}

.title-content h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  color: #e5e4e4;
}

.emote-list {
  list-style: none;
  padding: 0;
  overflow-y: auto;
}

.emote-item {
  padding: 3px;
  border-radius: 0.5rem;
  background-color: rgba(31, 31, 31, 0.94);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.emote-item .text-content {
  flex: 1;
}

.emote-item .text-content img {
  vertical-align: middle;
}

.emote-item .text-content em {
  font-style: italic;
}

a:hover {
  text-decoration: underline;
}

.emote-list::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.emote-list::-webkit-scrollbar-thumb {
  background: transparent;
}
</style>