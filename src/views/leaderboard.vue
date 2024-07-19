<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { brightenColor } from '../assets/utilities';
import { fetchBackend } from '../assets/request';
import { useRoute } from 'vue-router';

interface Leaderboard {
  bestName: string;
  rank?: number;
  farmSize?: number;
  farmName?: string;
  prestige?: number;
  potatoCount?: number;
  paint_count?: number;
  badge_count?: number;
  trivia_wins?: number;
  scramble_wins?: number;
  user_pfp: string;
  user_color: string;
}

const LeaderboardKinds = [
  'potatoes',
  'trivia',
  'scramble',
  'paints',
  'badges'
] as const;

type LeaderboardTypes = (typeof LeaderboardKinds)[number];

const route = useRoute();

let inputType = (route.query.type as string)?.toLowerCase() as LeaderboardTypes;

if (!route.query.type) inputType = 'potatoes';
else if (!LeaderboardKinds.includes(inputType)) inputType = 'potatoes';

let order = (route.query.order as string)?.toLowerCase()
if (!route.query.order) order = 'desc';
else if (!['asc', 'desc'].includes(order)) order = 'desc';

const 

loserOrLeader = ref<boolean>(order === 'asc' ? true : false),
type = ref<LeaderboardTypes>(inputType ?? 'potatoes'),
leaderboardList = ref<HTMLElement | null>(null),
cursor = ref<string | undefined>(undefined),
leaderboarders = ref<Leaderboard[]>([]),
map = new Map(),

fetchLeaderboard = async (type: LeaderboardTypes, last?: string | undefined) => {
  const response = await fetchBackend<Leaderboard>(`leaderboard`, {
    params: {
      order: loserOrLeader.value ? 'asc' : 'desc',
      after: last,
      type
    }
  })

  for (const user of response.data) {
    map.set(user.bestName, user);
  } 
  
  leaderboarders.value = [...map.values()];
  cursor.value = response?.pagination?.cursor;
},

handleScroll = () => {
  if (!leaderboardList.value) return;
  const { scrollTop, scrollHeight, clientHeight } = leaderboardList.value;

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    if (!cursor.value) return;
    fetchLeaderboard(type.value, cursor.value);
  }
},

fetchNewType = () => {
  leaderboarders.value = [];
  map.clear();
  cursor.value = undefined;
  fetchLeaderboard(type.value, undefined);
}

onMounted(() => {
  fetchLeaderboard(type.value, undefined);
});
</script>

<template>
  <div class="leaderboard" v-if="leaderboarders.length">
    <div class="leaderboard-options">
        <select v-model="loserOrLeader" class="type-box" @change="fetchNewType">
          <option :value=false>Leaderboard</option>
          <option :value=true>Loserboard</option>
        </select>
        <select v-model="type" class="type-box" @change="fetchNewType">
          <option value="potatoes">Potatoes</option>
          <option value="trivia">Trivia</option>
          <option value="scramble">Unscramble</option>
          <option value="paints">Paints</option>
          <option value="badges">Badges</option>
        </select>
    </div>
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
            <div v-if="type === 'potatoes'">
              <div>Prestige: {{ user.prestige }}</div>
              <div>Potatoes: {{ user.potatoCount?.toLocaleString() }}</div>
              <div>Farm: {{ user.farmName }}</div>
            </div>
            <div v-else-if="type === 'trivia'">
              <div>Trivia Wins: {{ user.trivia_wins?.toLocaleString()  }}</div>
            </div>
            <div v-else-if="type === 'scramble'">
              <div>Unscramble Wins: {{ user.scramble_wins?.toLocaleString()  }}</div>
            </div>
            <div v-else-if="type === 'paints'">
              <div>Paint Change Count: {{ user.paint_count?.toLocaleString() }}</div>
            </div>
            <div v-else-if="type === 'badges'">
              <div>Badge Change Count: {{ user.badge_count?.toLocaleString()  }}</div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>


<style scoped>

.leaderboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.leaderboard-options {
  display: flex;
  gap: 10px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: rgba(31, 31, 31, 0.94);
  padding: 10px;
  border-radius: 0.5rem;
}

.type-box {
  outline: auto -webkit-focus-ring-color;
  outline-color: #f4f4f4;
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: rgba(31, 31, 31, 0.94);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
  text-align: left;
  color: #e5e4e4;
  width: 100%;
  max-height: 85vh;
  padding-top: 10px;
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