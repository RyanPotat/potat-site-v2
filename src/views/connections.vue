<script setup lang="ts">
import { onMounted } from 'vue';
import { fetchBackend } from '../assets/request';

const connect = async (platform: string) => {
  const url = await fetchBackend(`auth/${platform.toLowerCase()}/authorize`, {
    auth: true
  }).then(res => res.data[0])

  window.open(url, '_blank', 'width=600,height=800');
};

onMounted(() => {
  console.log('Connections page mounted');
});
</script>

<template>
  <div class="container">
    <div class="connections-box">
      <h2>Connect a Platform</h2>
      <div class="buttons-container">
        <button style="background-color:#02A9FF" @click="connect('ANILIST')">Anilist</button>
        <button style="background-color:#5865F2" @click="connect('DISCORD')">Discord</button>
        <button style="background-color:#1DB954" @click="connect('SPOTIFY')">Spotify</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 400px;
  margin: auto;
  background-color: rgba(31, 31, 31, 0.906);
  border-radius: 15px;
  padding: 20px;
  overflow-y: auto;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

h2 {
  color: white;
  text-align: center;
  margin-bottom: 15px;
  font-size: 24px;
}

.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  padding: 12px 16px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  text-align: center;
}

button:hover {
  filter: brightness(0.9);
}
</style>
