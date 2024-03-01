<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { default as eventBus } from '../assets/eventBus';
import { applyPaint, Paint } from '../assets/applyPaint';

interface AuthToken {
  value: string | null;
}

interface UserState {
  value: string | null;
}

interface TwitchUser {
  chatColor: string | null;
  userPaint: Paint | null;
  stv_pfp: string | null;
  twitch_pfp: string | null;
  name: string | null;
}

const authToken: AuthToken = reactive({ value: localStorage.getItem('authorization') });
const userState: UserState = reactive({ value: localStorage.getItem('userState') });
const twitchUser = ref<TwitchUser | null>(null);

const isAuthenticated = computed(() => {
  return authToken.value !== null && userState.value !== null;
});

async function signIn() {
  window.open('https://api.potat.app/login', '_blank', 'width=600,height=400');
}

async function assignUser(token: string) {
  if (!isAuthenticated.value) return;

  const userData = await fetch('https://api.potat.app/twitch', {
    method: 'GET',
    headers: {
      authorization: 'Bearer ' + token,
    },
  })
    .then((res) => res.json())
    .then((data) => (twitchUser.value = data));

  if (userData?.chatColor && !userData?.userPaint)
    document.querySelector('.twitch-user span')?.setAttribute('style', `color: ${userData.chatColor}`);

  if (userData?.userPaint) applyPaint(userData.userPaint, '.twitch-user span');
}

onMounted(() => {
  assignUser(authToken.value as string);

  const handleMessage = (event: MessageEvent) => {
    const { id, login, name, stv_id, token, is_channel } = event.data;

    if (!token) return;

    localStorage.setItem('authorization', token);
    localStorage.setItem(
      'userState',
      JSON.stringify({ id, login, name, stv_id, is_channel })
    );

    authToken.value = token;
    eventBus.$emit('newToken', {
      token,
      user: JSON.stringify({ id, login, name, stv_id, is_channel }),
    });
    userState.value = JSON.stringify({ id, login, name, stv_id, is_channel });
    assignUser(token);
    window.removeEventListener('message', handleMessage);
  };

  window.addEventListener('message', handleMessage);
});

</script>

<template>
  <div class="login-button-container">
    <template v-if="isAuthenticated">
      <div class="twitch-user">
        <img box-shadow="0 0 0 2px #8763b8" v-if="twitchUser && twitchUser.twitch_pfp"
          :src="twitchUser.stv_pfp ? twitchUser.stv_pfp : twitchUser.twitch_pfp" alt="Twitch Profile Picture"
          class="profile-picture" :style="{ boxShadow: `0 0 0 2px ${twitchUser.userPaint ? '#808080' : twitchUser?.chatColor}` }" />
        <span>{{ twitchUser?.name }}</span>
      </div>
    </template>
    <template v-else>
      <button class="twitch-button" type="button" @click="signIn">
        <img src="/Twitch-icon-white.png" style="width: 1.5em; height: 1.5em;" />
        <span class="button-text">SIGN IN</span>
      </button>
    </template>
  </div>
</template>

<style scoped>
.twitch-button {
  cursor: pointer;
  border-radius: 0.5em;
  border: 1px solid transparent;
  padding: 0.25em;
  font: inherit;
  font-size: 0.88em;
  transition: background-color 0.2s ease;
  background-color: #6441a4;
  color: #fff;
  outline: 4px solid #8763b8;
}

.twitch-user {
  display: flex;
  align-items: center;
  font: inherit;
  font-size: 1.5em;
  font-weight: bolder;
}

.profile-picture {
  width: 1.6em;
  height: 1.6em;
  border-radius: 50%;
  margin-right: 0.3em;
}

.twitch-button:focus-visible {
  outline: 10px auto -webkit-focus-ring-color;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.login-button-container {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
}

.twitch-button:focus-visible {
  outline: 10px auto -webkit-focus-ring-color;
}

button:hover {
  outline-color: #f4f4f4;

}

.button-text {
  margin-left: 0.5em;
  font-weight: bold;
}
</style>
