<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import eventBus from '../assets/eventBus';
import { delay } from '../assets/utilities';
import { fetchBackend } from '../assets/request';
import { GenericResponse } from '../types/request';

interface UpdateEvent {
  data: any;
  topic: string;
}

const data: Ref = ref({});
onMounted(async () => {
    data.value = await fetchBackend<GenericResponse<any>>('').then(res => res?.data?.[0])

    eventBus.$on('update', async (stats) => {
      const { data: update, topic } = stats as UpdateEvent;
      switch (topic) {
        case 'commands-executed':
          data.value.misc.commandsUsed = update.totalCount;
          break;
        case 'new-user':
          data.value.twitch.usersSeen += 1;
          break;
        case 'active-channels':
          data.value.twitch.activeChannels = update.activeCount;
          break;
        case 'emote-actions':
          if (update.action !== 'ADD') return
          data.value.misc.emotesAdded += 1;
          break;
        case 'potato-update':
          for (let i = 0; i < update.updateCount; i++) {
            data.value.potato.total += 1;
            await delay(Math.min(15, 5000/update.updateCount));
          }
          break;
      }
    })
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
      <span>{{ data?.twitch?.activeChannels.toLocaleString() }}</span>
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