<script setup lang="ts">
import { ref, onMounted } from 'vue';

const data: any = ref({}); // Use ref to create reactive data

onMounted(async () => {
  try {
    data.value = await fetch('https://api.potat.app').then((res) => res.json());
    console.log(data.value)
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
</script>

<template>
  <div class="text-container">
    <div class="line" style="margin-bottom: 10px;">
      <strong>Commands executed:</strong>
      <span>{{ data?.misc?.commandsUsed.toLocaleString() }}</span>
    </div>
    <div class="line" style="margin-bottom: 10px;">
      <strong>Emotes added:</strong>
      <span>{{ data?.misc?.emotesAdded.toLocaleString() }}</span>
    </div>
    <div class="line">
      <strong>Potatoes farmed:</strong>
      <span>{{ data?.potato?.total.toLocaleString() }}</span>
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