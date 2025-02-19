<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { brightenColor } from '../assets/utilities';
import { fetchBackend } from '../assets/request';
import { useRoute } from 'vue-router';
import router from '../router';

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
  emote_count?: string;
  scramble_wins?: number;
  command_count?: string;
  user_pfp: string;
  user_color: string;
}

interface Stat {
  user_count: number;
  percentage: number;
  rank: number;
}

type ColorStat = {
  color: string;
} & Stat;

type BadgeStat = {
  badge: string;
  url?: string;
  clickAction?: string;
  name: string;
} & Stat

const LeaderboardTypes = [
  'commandschannel',
  'emoteschannel',
  'twitchbadges',
  'twitchcolors',
  'commandsuser',
  'emotesuser',
  'scramble',
  'potatoes',
  'trivia',
  'paints',
  'badges',
] as const;

type LeaderboardTypes = (typeof LeaderboardTypes)[number];

const route = useRoute();

let inputType = (route.query.type || route.params.type)?.toString().toLowerCase() as LeaderboardTypes;
inputType =  inputType && LeaderboardTypes.includes(inputType) ? inputType : 'potatoes';

let order = (route.query.order as string)?.toLowerCase();
if (!order || !['asc', 'desc'].includes(order)) {
	order = route.path.includes('loserboard') ? 'asc' : 'desc';
}

const

loserOrLeader = ref<boolean>(order === 'asc' ? true : false),
type = ref<LeaderboardTypes>(inputType ?? 'potatoes'),
cursor = ref<string | undefined>(undefined),
leaderboarders = ref<Leaderboard[]>([]),
badgeStats = ref<BadgeStat[]>([]),
colorStats = ref<ColorStat[]>([]),
map = new Map(),
loading = ref(false),

fetchLeaderboard = async (type: LeaderboardTypes, last?: string | undefined) => {
	if (loading.value) {
		return;
	}

	loading.value = true;

	try {
    if (type === 'twitchbadges') {
      const response = await fetchBackend<BadgeStat>(`twitch/badges`, {
        params: { first: 200 }
      }).then(res => res?.data?.map(b => {
        if (b.badge === 'NOBADGE') return;
        if (!b.url) return b;
        const lastSlashIndex = b.url.lastIndexOf("/");
        b.url = b.url.substring(0, lastSlashIndex + 1) + "3";
        b.rank = b.rank -1;
        return b;
      }).filter(Boolean)as BadgeStat[]);

      badgeStats.value = response.sort((a, b) => {
        if (loserOrLeader.value) {
          return b.rank - a.rank;
        } else {
          return a.rank - b.rank;
        }
      });
    } else if (type === 'twitchcolors') {
      const response = await fetchBackend<ColorStat>(`twitch/colors`, {
        params: { 
          first: 200,
          after: last,
        }
      });
      const colors = response?.data?.map(c => {
        if (c.color === 'NOCOLOR') return;
        c.rank = c.rank -1;
        return c;
      }).filter(Boolean) as ColorStat[];

      for (const color of colors) {
        map.set(color.color, color);
      }
      colorStats.value = [...map.values()].sort((a, b) => a.rank - b.rank);
      cursor.value = response?.pagination?.cursor;
    } else {
      const response = await fetchBackend<Leaderboard>(`leaderboard`, {
        params: {
          order: loserOrLeader.value ? 'asc' : 'desc',
          after: last,
          type
        }
      });

      for (const user of response.data) {
        map.set(user.bestName, user);
      }
      leaderboarders.value = [...map.values()]
      cursor.value = response?.pagination?.cursor;
    }
	} finally {
		loading.value = false;
	}
},

handleScroll = () => {
	// if scroll to the end of the window
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
		if (!cursor.value) return;
		fetchLeaderboard(type.value, cursor.value);
	}
},

fetchNewType = () => {
	router.push({
		path: `/${loserOrLeader.value ? 'loserboard' : 'leaderboard'}/${type.value}`,
		force: true // vite thinks loserboard is the same as leaderboard because it's an alias
	});
  leaderboarders.value = [];
  map.clear();
  cursor.value = undefined;
  if (type.value === 'twitchcolors') {
    loserOrLeader.value = false;
  }
  fetchLeaderboard(type.value, undefined);
},

getLocale = (value: string | undefined) => {
  return parseInt(value as string).toLocaleString();
}

onMounted(() => {
  fetchLeaderboard(type.value, undefined);

	addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
	removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="leaderboard">
    <div class="leaderboard-options">
        <select v-model="loserOrLeader" class="type-box" @change="fetchNewType">
          <option :value=false>Leaderboard</option>
          <option :value=true>Loserboard</option>
        </select>
        <select v-model="type" class="type-box" @change="fetchNewType">
          <option value="potatoes">Potatoes</option>
          <option value="trivia">Trivia</option>
          <option value="scramble">Unscramble</option>
          <option value="paints">7TV Paints</option>
          <option value="badges">7TV Badges</option>
          <option value="emoteschannel">Channel Emotes Actions</option>
          <option value="emotesuser">User Emote Actions</option>
          <option value="commandschannel">Channel Commands Used</option>
          <option value="commandsuser">User Commands Used</option>
          <option value="twitchbadges">Twitch Global Badges</option>
          <option value="twitchcolors">Twitch Chat Colors</option>
        </select>
    </div>
    <ul v-if="colorStats.length && type === 'twitchcolors'" class="leaderboard-list">
      <li v-for="color in colorStats" :key="color.color" class="leaderboard-item">
        <div class="color-bar" :style="{ backgroundColor: color.color }"></div>
        <div class="text-content">
          <div><strong>Color:</strong> {{ color.color }}</div>
          <div><strong>Users Seen:</strong> {{ color.user_count.toLocaleString() }}</div>
          <div><strong>Percentage:</strong> {{ color.percentage.toFixed(6) }}%</div>
          <div><strong>Rank:</strong> {{ color.rank }}</div>
        </div>
      </li>
    </ul>
    <ul v-if="badgeStats.length && type === 'twitchbadges'" class="leaderboard-list">
      <li v-for="badge in badgeStats" :key="badge.badge" class="leaderboard-item">
        <div class="badge-picture">
          <a :href="badge.clickAction" target="_blank">
            <img :src="badge.url" alt="Badge"/>
          </a>
        </div>
        <div class="text-content">
          <div><strong>Badge:</strong> {{ badge.name ?? badge.badge }}</div>
          <div><strong>Users Seen:</strong> {{ badge.user_count.toLocaleString() }}</div>
          <div><strong>Percentage:</strong> {{ badge.percentage.toFixed(6) }}%</div>
          <div><strong>Rank:</strong> {{ badge.rank }}</div>
        </div>
      </li>
    </ul>
    <ul class="leaderboard-list" v-if="leaderboarders.length && type !== 'twitchbadges'">
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
              <div>7TV Paint Change Count: {{ user.paint_count?.toLocaleString() }}</div>
            </div>
            <div v-else-if="type === 'badges'">
              <div>7TV Badge Change Count: {{ user.badge_count?.toLocaleString()  }}</div>
            </div>
            <div v-else-if="type === 'emoteschannel'">
              <div>Total Channel Emote Actions: {{ getLocale(user.emote_count) }}</div>
            </div>
            <div v-else-if="type === 'emotesuser'">
              <div>Total User Emote Actions: {{ getLocale(user.emote_count) }}</div>
            </div>
            <div v-else-if="type === 'commandschannel'">
              <div>Total Channel Commands Used: {{ getLocale(user.command_count) }}</div>
            </div>
            <div v-else-if="type === 'commandsuser'">
              <div>Total User Commands Used: {{ getLocale(user.command_count) }}</div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>


<style scoped>
.leaderboard {
	padding: 5px;
}
.leaderboard-options {
  display: flex;
  gap: 10px;
  position: sticky;
  top: 75px;
	height: 75px;
  z-index: 1;
  background-color: rgba(30, 25, 37, 0.94);
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

.leaderboard-list {
  list-style: none;
  padding: 0;
  text-align: left;
  color: #e5e4e4;
	margin: 0;
	padding: 10px;
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

.badge-picture img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  margin-left: 10px
}

.color-bar {
  width: 200px;
  height: 80px;
  border-radius: 4px;
  margin-right: 10px;
}
</style>
