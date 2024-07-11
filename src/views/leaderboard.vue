<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { brightenColor } from '../assets/utilities';
import { fetchBackend } from '../assets/request';

interface Leaderboard {
  bestName: string;
  rank: number;
  farmSize: number;
  farmName: string;
  prestige: number;
  potatoCount: number;
  user_pfp: string;
  user_color: string;
}

const 

leaderboarders = ref<Leaderboard[]>([]),
cursor = ref<string | undefined>(undefined),
leaderboardList = ref<HTMLElement | null>(null),
loserOrLeader = ref<boolean>(false),
imRetarded = new Map(),

fetchLeaderboard = async (last?: string | undefined, loserBoard = false) => {
  const response = await fetchBackend<Leaderboard>(`leaderboard`, {
    params: {
      order: loserBoard ? 'asc' : 'desc',
      after: last
    }
  })

  for (const user of response.data) {
    imRetarded.set(user.bestName, user);
  } 
  
  leaderboarders.value = [...imRetarded.values()];
  cursor.value = response?.pagination?.cursor;
},

handleScroll = () => {
  if (!leaderboardList.value) return;
  const { scrollTop, scrollHeight, clientHeight } = leaderboardList.value;

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    fetchLeaderboard(cursor.value, loserOrLeader.value);
  }
};

onMounted(() => {
  fetchLeaderboard(undefined, loserOrLeader.value);
});
</script>

<template>
  <div id="container" v-if="leaderboarders.length">
    <ul class="leaderboard-list" ref="leaderboardList" @scroll="handleScroll">
      <li v-for="user in leaderboarders" :key="user.bestName" class="leaderboard-item">
        <div class="profile-picture">
          <a :href="`https://twitch.tv/${user.bestName.toLowerCase()}`" target="_blank">
            <img :src="user.user_pfp ?? 'https://gachi.gay/sgJNs'"/>
          </a>
        </div>
        <div class="text-content">
          <div class="rank-name">
            #{{ leaderboarders.indexOf(user) + 1 }} 
            <a :href="`https://twitch.tv/${user.bestName.toLowerCase()}`" target="_blank">
              <strong :style="{ color: brightenColor(user.user_color) }">{{ user.bestName }}</strong>
            </a>
          </div>
          <div class="details">
            <div>Prestige: {{ user.prestige }}</div>
            <div>Potatoes: {{ user.potatoCount.toLocaleString() }}</div>
            <div>Farm: {{ user.farmName }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>


<style scoped>

#container {
  max-height: 93vh;
  width: 95%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  color: #e5e4e4;
}

body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  line-height: 1.5;
  background-color: #3d3d3d;
}

.leaderboard-list {
  list-style: none;
  padding: 0;
  overflow-y: auto;
}

.leaderboard-item {
  padding: 3px;
  border-radius: 0.5rem;
  background-color: rgba(31, 31, 31, 0.94);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.leaderboard-item .text-content img {
  vertical-align: middle;
}

.profile-container {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: rgba(31, 31, 31, 0.94);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.profile-picture img {
  border-radius: 50%;
  margin-right: 5px;
  width: 80px;
  height: 80px;
  vertical-align: middle;
}

.text-content {
  display: flex;
  flex-direction: column;
}

.rank-name {
  font-size: 20px;
}

.leaderboard-list::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.leaderboard-list::-webkit-scrollbar-thumb {
  background: transparent;
}
</style>