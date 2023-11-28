<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { eventBus } from '../assets/eventBus.js';

const authorizationToken = reactive({ value: localStorage.getItem('authorization') });
const userState = reactive({ value: localStorage.getItem('userState') });

const isAuthenticated = computed(() => {
  return authorizationToken.value !== null || userState.value !== null;
});

const newState = reactive({value: JSON.parse(userState.value)?.is_channel})

const isChannel = computed(() => {
  return userState.value !== null && newState.value;
});

const isOperationInProgress = ref(false);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function join() {
  if (isOperationInProgress.value) return;

isOperationInProgress.value = true;
  newState.value = true
  fetch('https://api.potat.app/join', {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + authorizationToken.value
    }
  })

  await delay(3000);
  isOperationInProgress.value = false;
}

async function part() {
  if (isOperationInProgress.value) return;

isOperationInProgress.value = true;
  newState.value = false
  fetch('https://api.potat.app/part', {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + authorizationToken.value
    }
  })

  await delay(3000);
  isOperationInProgress.value = false;
}

const isShaking = ref(false);

const shakeButton = () => {
  isShaking.value = true;

  setTimeout(() => {
    isShaking.value = false;
  }, 500);
};

onMounted(async () => {
  eventBus.$on('newToken', ({token, user}) => {
    authorizationToken.value = token;
    userState.value = user;
    newState.value = JSON.parse(user).is_channel
  });

  if (isAuthenticated) {
    const user = JSON.parse(userState.value)
    const userData = await fetch(
      `https://api.potat.app/users/${user?.login}`
    ).then(res => res.json())

    newState.value = userData[0]?.channel?.isChannel
  }
});
</script>

<template>
  <div>
    <template v-if="isAuthenticated && isChannel">
      <button class="part-button" type="button" @click="part">Part</button>
    </template>
    <template v-else-if="isAuthenticated">
      <button class="join-button" type="button" @click="join">Join</button>
    </template>
    <template v-else>
      <button @click="shakeButton" :class="{ 'shake': isShaking }">Join</button>
    </template>
  </div>
</template>

<style scoped>
.part-button,
.join-button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
  text-shadow: -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333;
}

.join-button {
  background-color: #4CAF50;
}

.part-button {
  background-color: #ec2f2f;
}

.part-button:hover,
.join-button:hover {
  border-color: #fdfdfd;
}

.part-button:focus,
.part-button:focus-visible,
.join-button:focus,
.join-button:focus-visible {
  outline: 6px auto -webkit-focus-ring-color;
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}
</style>
