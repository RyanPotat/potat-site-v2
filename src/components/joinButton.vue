<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { default as eventBus } from '../assets/eventBus';
import { delay } from '../assets/utilities';
import { fetchBackend } from '../assets/request';
import { AuthorizationToken, TokenUserData, UserState } from '../types/misc';

const 

authorizationToken: AuthorizationToken = reactive({ value: localStorage.getItem('authorization') }),
userState: UserState = reactive({ value: localStorage.getItem('userState') }),

isAuthenticated = computed<boolean>(() => {
  return authorizationToken.value !== null || userState.value !== null;
}),

newState = reactive<{ value: boolean }>({ value: JSON.parse(userState.value as string)?.is_channel }),

isChannel = computed<boolean>(() => {
  return userState.value !== null && newState.value;
}),

signOut = (): void => {
  localStorage.clear();
  userState.value = null;
  authorizationToken.value = null;
  newState.value = false;
},

isOperationInProgress = ref(false),

join = async () => {
  if (isOperationInProgress.value) return;

  isOperationInProgress.value = true;
  newState.value = true;

  const result = await fetchBackend('join', { method: 'POST', auth: true })
  if ([401, 418].includes(result?.statusCode)) {
    console.log('Signing out due to error:', result?.errors?.[0]?.message);
    signOut();
    return eventBus.$emit('signOut');
  }

  await delay(3000);
  isOperationInProgress.value = false;
},

part = async () => {
  if (isOperationInProgress.value) return;

  isOperationInProgress.value = true;
  newState.value = false;

  const result = await fetchBackend('part', { method: 'DELETE', auth: true })
  if ([401, 418].includes(result?.statusCode)) {
    console.log('Signing out due to error:', result?.errors?.[0]?.message);
    signOut();
    return eventBus.$emit('signOut');
  }

  await delay(3000);
  isOperationInProgress.value = false;
},

isShaking = ref(false),

shakeButton = () => {
  isShaking.value = true;

  setTimeout(() => {
    isShaking.value = false;
  }, 500);
};

onMounted(async () => {
  eventBus.$on('newToken', ({ token, user }: TokenUserData) => {
    authorizationToken.value = token;
    userState.value = user;
    newState.value = JSON.parse(user).is_channel;
  });

  eventBus.$on('signOut', () => {
    signOut();
  });

  if (isAuthenticated.value) {
    const user = JSON.parse(userState.value as string);
    const userData = await fetchBackend(`users/${user?.login}`)
    newState.value = userData.data?.[0]?.channel?.isChannel;
  }
});

</script>

<template>
  <div class="button-box">
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
.button-box {
  background-color: rgba(31, 31, 31, 0.8);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  justify-content: center;
  user-select: none;
  top: 50px;
  transform: scale(1.5); 
  margin-bottom: 20px;
}

.part-button,
.join-button {
  border-radius: 8px;
  border: 2px solid transparent;
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
