<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { default as eventBus } from '../assets/eventBus';
import { delay } from '../assets/utilities';

interface UserState {
  value: string | null;
}

interface AuthorizationToken {
  value: string | null;
}

interface TokenUserData {
  token: string;
  user: string;
}

const authorizationToken: AuthorizationToken = reactive({ value: localStorage.getItem('authorization') });
const userState: UserState = reactive({ value: localStorage.getItem('userState') });

const isAuthenticated = computed<boolean>(() => {
  return authorizationToken.value !== null || userState.value !== null;
});

const newState = reactive<{ value: boolean }>({ value: JSON.parse(userState.value as string)?.is_channel });

const isChannel = computed<boolean>(() => {
  return userState.value !== null && newState.value;
});

const signOut = (): void => {
  localStorage.clear();
  userState.value = null;
  authorizationToken.value = null;
  newState.value = false;
  console.log('Signed out');
}

const isOperationInProgress = ref(false);

const join = async () => {
  if (isOperationInProgress.value) return;

  isOperationInProgress.value = true;
  newState.value = true;

  fetch('https://api.potat.app/join', {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('authorization'),
    },
  }).then(res => res.json())
    .then(data => {
      if ([401, 418].includes(data?.errors?.statusCode)) {
        console.log('Signing out due to error:', data?.errors?.message);
        signOut();
        return eventBus.$emit('signOut');
      }
      return data;
    });

  await delay(3000);
  isOperationInProgress.value = false;
}

const part = async () => {
  if (isOperationInProgress.value) return;

  isOperationInProgress.value = true;
  newState.value = false;

  fetch('https://api.potat.app/part', {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('authorization'),
    },
  }).then(res => res.json())
    .then(data => {
      if ([401, 418].includes(data?.errors?.statusCode)) {
        console.log('Signing out due to error:', data?.errors?.message);
        signOut();
        return eventBus.$emit('signOut');
      }
      return data;
    });

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
    const userData = await fetch(`https://api.potat.app/users/${user?.login}`)
      .then(res => res.json());

    newState.value = userData[0]?.channel?.isChannel;
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
