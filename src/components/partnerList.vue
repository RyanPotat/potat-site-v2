<script setup lang="ts">
import { ref, onMounted, computed, Ref } from 'vue';
import { humanizeDuration, brightenColor } from '../assets/utilities';

export interface Partner {
  username: string;
  display: string;
  stv_pfp: string;
  twitch_pfp: string;
  page_url: string;
  followers: number;
  joined_at: string;
  command_count: number;
  user_color: string;
}

const partners: Ref<Partner[] | []> = ref([])

let interval = ref<NodeJS.Timeout | null>(null);
const
  index = ref(0),
  isTransitioning = ref(false),
  current = computed(() => partners.value[Math.abs(index.value) % partners.value.length]),

  cyclePartners = (isClick?: boolean) => {
    if (isTransitioning.value) return;

    clearInterval(interval.value!);
    if (isClick) index.value++;

    isTransitioning.value = true;

    interval.value! = setInterval(() => {
      index.value++;
    }, 5000);

    setTimeout(() => {
      isTransitioning.value = false;
    }, 1000);
  },

  getDate = (date: string) => {
    const joined = new Date(date);
    const now = new Date();
    return humanizeDuration(now.getTime() - joined.getTime(), 2);
  }

onMounted(async () => {
  // Fetch partners
  partners.value = await fetch('https://api.potat.app/partners')
    .then((res) => res.json())
    .then(data => data.data as Partner[]);
    
  // Preload images
  partners.value.forEach(partner => {
    const img = new Image();
    img.src = partner?.stv_pfp ?? partner?.twitch_pfp ?? '';
  })

  cyclePartners();
});
</script>

<template>
  <div v-if="partners.length" class="slider-container" @click="cyclePartners(true)">
    <div class="partner-title">
      <h2><strong>Featured partners using the bot:</strong></h2>
    </div>
    <div class="partner-container">
      <Transition name="slide-fade" mode="out-in" tag="div">
      <div v-if="current" :key="index" class="partner-container">
        <div class="slider-item">
          <div class="pfp-container">
            <a :href="current.page_url" target="_blank">
              <img :src="current.stv_pfp ?? current.twitch_pfp">
            </a>
          </div>
          <div class="text-container" :style="{ color: brightenColor(current.user_color, 25) }">
            <div>
              <strong>{{ current.display }}</strong>
            </div>
            {{ current.followers.toLocaleString() }} followers
            <br />
            Joined {{ getDate(current.joined_at) }} ago
            <br />
            Used {{ current.command_count.toLocaleString() }} total commands
          </div>
        </div>
      </div>
    </Transition>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
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

.slider-item {
  width: 350px;
  height: 110px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.slide-fade-enter-active {
  transition: all 0.5s ease-in;
}

.slide-fade-leave-active {
  transition: all -1s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}


.partner-title {
  display: flex;
  justify-content: center;
  margin-top: -20px;
}

.partner-container {
  display: flex;
  flex: 1;
  justify-content: center;
  overflow: hidden;
}

.pfp-container img {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
  flex: 1
}
.text-container {
  height: 100px;
  width: 210px;
  flex: 1;
  background-color: rgba(31, 31, 31, 0.503);
  border-radius: 15px;
}
</style>