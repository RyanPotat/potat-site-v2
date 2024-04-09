<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';

const data: Ref = ref({});
onMounted(async () => {
    data.value = await fetch('https://api.potat.app')
      .then((res) => res.json())
      .catch(console.error)
});
</script>

<template>
  <div v-if="data.misc" class="text-container">
    <div class="line" style="margin-bottom: 10px;">
      <strong>Commands executed:</strong>
      <span>{{ data?.misc?.commandsUsed.toLocaleString() }}</span>
    </div>
    <div class="line" style="margin-bottom: 10px;">
      <strong>Potatoes farmed:</strong>
      <span>{{ data?.potato?.total.toLocaleString() }}</span>
    </div>
    <div class="line" style="margin-bottom: 10px;">
      <strong>Active channels:</strong>
      <span>{{ data?.twitch?.activeChannels }}</span>
    </div>
    <div class="line" style="margin-bottom: 10px;">
      <strong>Emotes added:</strong>
      <span>{{ data?.misc?.emotesAdded.toLocaleString() }}</span>
    </div>
    <div class="line">
      <strong>Users seen:</strong>
      <span>{{ parseInt(data?.twitch?.usersSeen).toLocaleString() }}</span>
    </div>
  </div>
</template>

<style scoped>
.text-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-shadow: -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333;
  user-select: none;
  background-color: rgba(31, 31, 31, 0.8);
  border-radius: 15px;
  padding: 20px;
  margin-left: 100px;
  margin-top: 50px;
}

.line {
  display: flex;
  align-items: center;
}

strong {
  min-width: 160px;
  text-align: right;
  margin-right: 10px;
}
</style>