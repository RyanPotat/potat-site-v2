<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { humanizeDuration } from '../assets/utilities';

export interface Command {
  name: string;
  title: string;
  description: string;
  usage: string;
  category: string;
  aliases: string[];
  params: Object
  cooldown: number;
  development: boolean;
  joinchannel: boolean;
  potatoRequire: boolean;
  potato: boolean;
  level: number;
  ryan: boolean;
  botPerms: string;
  permission: number;
  whisperable: boolean;
  offline: boolean;
  botIgnore: boolean;
}

interface Object {
  [key: number | string]: string;
}

const
  permissions: Object = {
    1: 'VIP',
    1.5: 'Moderator',
    2: 'Broadcaster or Ambassador',
  },

  ranks: Object = {
    0: 'Blacklisted',
    1: 'Standard users',
    2: 'Bot moderators',
    3: 'Bot admins',
    4: 'Bot developers'
  },

  botPerms: Object = {
    'mod': 'Moderator',
    'vip': 'VIP'
  },

  changeCategory = (category: string) => {
    selectedCategory.value = category;
    const categoryCommands = getCategory.value;
   
    const lastCommand = localStorage.getItem(`last${category}`);
    selectedCommand.value = lastCommand ?? (categoryCommands[0]?.name ?? '');
    
    localStorage.setItem('lastCategory', category);
  },

  changeCommand = (command: Command) => {
    selectedCommand.value = command.name;
    
    localStorage.setItem(`last${getCategory.value[0].category}`, command.name);
  },

  upperCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  checkArray = (arr: string[] | undefined) => {
    return arr && arr.length && arr.some(a => a.trim() !== '')
  },

  categories = computed(() => {
    return [...new Set(commands.value.map(command => command.category))].filter(Boolean);
  }),

  getCategory = computed(() => {
      return commands.value.filter(command => command.category === selectedCategory.value);
  }),

  getCommand = computed(() => {
    return commands.value.find(command => command.name === selectedCommand.value);
  }),

  commands = ref<Command[] | []>([]),
  selectedCategory = ref<string>(localStorage.getItem('lastCategory') || 'utilities'),
  selectedCommand = ref<string>(localStorage.getItem(`last${selectedCategory}`) || 'join');

onMounted(() => {
  fetch('https://api.potat.app/help')
    .then((res) => res.json())
    .then((data) => (commands.value = data))
    .catch(console.error)
});

</script>

<template>
  <div v-if="commands.length > 0" id="help-container">
    <div class="sidebar-container">
      <div style="flex-direction: column"></div>
      <div class="sidebar">
        <div v-for="category in categories" :key="category">
          <button @click="changeCategory(category)" :class="{ active: category === selectedCategory }">{{ category }}</button>
        </div>
      </div>

      <div class="sidebar">
        <div v-for="command in getCategory" :key="command.name">
          <button @click="changeCommand(command)" :class="{ active: command.name === selectedCommand }">{{ command.name }}</button>
        </div>
      </div>
    </div>

    <div style="margin-left: 20px;">
        <div v-if="getCommand">
          <h2 class="command-title">{{ getCommand.title }}</h2>
          <div class="command-details">
            <div>
              <p v-if="getCommand.description">
                <strong>Description: </strong>{{ getCommand.description }}
              </p>
              <p v-if="getCommand.usage">
                <strong>Usage: </strong>{{ getCommand.usage }}
              </p>
              <p v-if="checkArray(getCommand.aliases)">
                <strong>Aliases: </strong>{{ getCommand.aliases.join(', ') }}
              </p>
              <p v-if="getCommand.cooldown">
                <strong>Cooldown: </strong>{{ humanizeDuration(getCommand.cooldown, 1) }}
              </p>
              <p v-if="getCommand.level">
                <strong>Available to: </strong> {{ ranks[getCommand.level] }}
              </p>
              <p v-if="getCommand.botPerms">
                <strong>Bot requires: </strong>{{ botPerms[getCommand.botPerms] }}
              </p>
              <p v-if="getCommand.permission">
                <strong>User requires: </strong>{{ permissions[getCommand.permission] }}
              </p>
              <p>
                <strong>Whisperable: </strong>{{ getCommand.whisperable ?? 'false' }}
              </p>
              <p v-if="getCommand.offline">
                <strong>Offline only: </strong>{{ getCommand.offline }}
              </p>
              <p v-if="getCommand.botIgnore">
                <strong>Bot Ignore: </strong>{{ getCommand.botIgnore }}
              </p>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<style scoped>

#help-container {
  display: flex;
  position: fixed;
  justify-content: center; 
  left: 0;
  top: 100px;
  width: 100%;
}

.command-details {
  display: flex;
  text-align: left;
  width: 600px;
  align-items: top;
  display: flex;
  text-wrap: wrap;
  background-color: #1a1a1a;
  border-radius: 15px;
  padding: 20px;
  background-color: rgba(31, 31, 31, 0.906);
  text-align: left;
  overflow-y: auto;
  max-height: 80vh;
  margin-right: 100px;
  margin: auto;
}

.command-title {
  display: inline-flex;
  justify-content: center;
  min-width: 100px;
  margin-bottom: 20px;
  border-radius: 15px;
  padding: 20px;
  background-color: rgba(31, 31, 31, 0.906);
  outline: auto -webkit-focus-ring-color;
  outline-color: #f4f4f4;
}

.sidebar-container {
  display: flex;

}

.sidebar {
  display: flex;
  flex-direction: column;
  max-height: 405px;
  position: relative;
  overflow-y: auto;
  margin-left: 20px;
}

.sidebar::-webkit-scrollbar {
  width: 0px;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: transparent;
}

button {
  cursor: pointer;
  position: relative;
  z-index: 1;
  min-width: 120px;
  background-color: rgba(31, 31, 31, 0.84);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 10px;
  outline: auto -webkit-focus-ring-color;
  outline-color: #f4f4f4;
  user-select: none;
  transition: background-color 0.3s ease;
}

button.active {
  background-color: #6441a4;
  color: #fff;
  outline: none;
}

</style>