<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { eventBus } from '../assets/eventBus.js';

const authorizationToken = reactive({ value: localStorage.getItem('authorization') });
const userState = reactive({ value: localStorage.getItem('userState') });
const twitchUser = ref(null);

const isAuthenticated = computed(() => {
  return authorizationToken.value !== null && userState.value !== null;
});

async function signIn() {
  window.open('https://api.potat.app/login', '_blank', 'width=600,height=400');
}

async function assignUser(token) {
  if (!isAuthenticated) return;
  
  const userData = await fetch('https://api.potat.app/twitch', {
    method: 'GET',
    headers: {
      authorization: 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(data => twitchUser.value = data)

  if (userData?.chatColor) {
    const userColor = userData.chatColor;
    document.querySelector('.twitch-user span').style.color = userColor;
  }
}

onMounted(() => {
  assignUser(authorizationToken.value)


  const handleMessage = (event) => {
    const { id, login, name, stv_id, token, is_channel } = event.data;

    if (token) {
      localStorage.setItem('authorization', token);
      localStorage.setItem('userState', JSON.stringify({ id, login, name, stv_id, is_channel }));

      authorizationToken.value = token;
      eventBus.$emit('newToken', { 
        token, 
        user: JSON.stringify({ id, login, name, stv_id, is_channel })
      });
      userState.value = JSON.stringify({ id, login, name, stv_id, is_channel });
      assignUser(token);
      window.removeEventListener('message', handleMessage);
    }
  };

  window.addEventListener('message', handleMessage);
});
</script>

<template>
  <div class="my-component">
    <template v-if="isAuthenticated">
      <div class="twitch-user">
        <!-- Circular cropped image scaled to text size here -->
        <img box-shadow="0 0 0 2px #8763b8" v-if="twitchUser && twitchUser.twitch_pfp"
          :src="twitchUser.stv_pfp ? twitchUser.stv_pfp : twitchUser.twitch_pfp" alt="Twitch Profile Picture"
          class="profile-picture" :style="{ boxShadow: `0 0 0 1px ${twitchUser.chatColor}` }" />
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

.pfp-component {
  position: aboslute;
  left: 0;
}

.my-component {
  position: aboslute;
  top: 0;
  right: 0;
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
