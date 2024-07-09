<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { humanizeDuration } from '../assets/utilities';
import { fetchBackend } from '../assets/request';

export interface Command {
  name: string;
  description: string;
  title: string;
  detailedDescription?: string;
  usage: string;
  category: CommandCategories;
  aliases: string[];
  flags: FlagDetails[];
  cooldown: number;
  level: InternalLevels;
  botRequires: BotCommandRequirements;
  userRequires: UserRequires;
  conditions: CommandConditions;
}

type CommandConditions = {
  offlineOnly?: boolean;
  whisperable?: boolean;
  ignoreBots?: boolean;
  isBlockable?: boolean;
  isNotPipable?: boolean;
};

type FlagDetails = {
  name: string;
  type: 'boolean' | 'string';
  level: InternalLevels;
  userRequires?: UserRequires;
  required: boolean;
  description: string;
  usage?: string;
  aliases?: string[];
};

enum InternalLevels {
  'Blacklisted',
  'Standard users',
  'Bot moderators',
  'Bot admins',
  'Bot developers',
}

type CommandCategories =
  | 'development'
  | 'moderation'
  | 'utilities'
  | 'unlisted'
  | 'settings'
  | 'stream'
  | 'potato'
  | 'emotes'
  | 'spam'
  | 'misc'
  | 'fun';

type UserRequires =
  | 'none'
  | 'subscriber'
  | 'vip'
  | 'mod'
  | 'ambassador'
  | 'broadcaster';

type BotCommandRequirements = 'none' | 'vip' | 'mod';

interface KeyString {
  [key: number | string]: string;
}

const
  permissions: KeyString = {
    'none': 'No Permissions',
    'subscriber': 'Subscriber',
    'vip': 'VIP',
    'mod': 'Moderator',
    'ambassador': 'Ambassador',
    'broadcaster': 'Broadcaster',
  },

  botPerms: KeyString = {
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
    return [...new Set(commands.value.map(command => command.category))].filter(each => {
      if (!Boolean(each)) return false;

      const filtered = filteredCommands.value.filter(command => command.category === each)
      if (filtered.length === 0) return false;
      return true;
    });
  }),

  getCategory = computed(() => {
      return filteredCommands.value.filter(command => command.category === selectedCategory.value);
  }),

  getCommand = computed(() => {
    return filteredCommands.value.find(command => command.name === selectedCommand.value);
  }),

  commands = ref<Command[] | []>([]),
  search = ref<string>(''),
  selectedCategory = ref<string>(localStorage.getItem('lastCategory') || 'utilities'),
  selectedCommand = ref<string>(localStorage.getItem(`last${selectedCategory}`) || 'join'),

  filteredCommands = computed((): Command[] => {
    if (!search.value) {
      return commands.value;
    }
    const query = search.value.toLowerCase();
    return commands.value.filter((command) => {
      return (
        (command.name.toLowerCase().includes(query) ||
        command.description.toLowerCase().includes(query) ||
        command.title.toLowerCase().includes(query))
      );
    });
  });

  onMounted(() => {
    fetchBackend<Command[]>('help').then((data) => commands.value = Object.values(data))
  });
</script>

<template>
  <div v-if="commands.length > 0" id="help-container">
    <div class="sidebar-container">
      <div style="flex-direction: column"></div>
      <div class="sidebar">
        <button>
          <input v-model="search" type="text" placeholder="Search..." class="search"/>
        </button>
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
              <strong>Available to: </strong> {{ InternalLevels[getCommand.level] }}
            </p>
            <p v-if="getCommand.botRequires !== 'none'">
              <strong>Bot requires: </strong>{{ botPerms[getCommand.botRequires] }}
            </p>
            <p v-if="getCommand.userRequires !== 'none'">
              <strong>User requires: </strong>{{ permissions[getCommand.userRequires] }}
            </p>
            <p>
              <strong>Whisperable: </strong>{{ getCommand.conditions.whisperable ?? 'false' }}
            </p>
            <p v-if="getCommand.conditions.offlineOnly">
              <strong>Offline only: </strong>{{ getCommand.conditions.offlineOnly }}
            </p>
            <p v-if="getCommand.conditions.ignoreBots">
              <strong>Ignores bots: </strong>{{ getCommand.conditions.ignoreBots }}
            </p>
            <p v-if="typeof getCommand.conditions.isNotPipable === 'boolean'">
              <strong>Can be piped: </strong>{{ !getCommand.conditions.isNotPipable }}
            </p>
            <p v-if="getCommand.flags?.length">
              <strong>Flags: </strong>
              <div v-for="(flag, index) in getCommand.flags" :key="index" class="flag-details">
                <p><strong>Name: </strong>{{ flag.name }}</p>
                <p><strong>Description: </strong>{{ flag.description }}</p>
                <p><strong>Type:</strong> {{ flag.type }}</p>
                <p><strong>Availiable to:</strong> {{ InternalLevels[flag.level] }}</p>
                <p v-if="flag.userRequires">
                  <strong>User requires: :</strong> {{ permissions[flag.userRequires] }}
                </p>
                <p v-if="flag.aliases?.length"><strong>Aliases:</strong> {{ flag.aliases.join(', ') }}</p>
                <p v-if="flag.required"><strong>Required: </strong> {{ flag.required ? 'Yes' : 'No' }}</p>
                <p v-if="flag.usage"><strong>Usage:</strong> {{ flag.usage }}</p>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<style scoped>

.search {
  padding: 10px;
  max-width: 80px;
  border-radius: 15px;
  background-color: rgba(31, 31, 31, 0.906);
  outline: auto -webkit-focus-ring-color;
  outline-color: #f4f4f4;
  color: white;
}

#help-container {
  display: flex;
  position: fixed;
  justify-content: center; 
  left: 0;
  top: 100px;
  width: 100%;
}

.flag-details {
  font-size: 0.9em;
  margin-top: 10px;
  padding: 10px;
  border-radius: 15px;
  background-color: #1e1c1c79;
  outline: auto -webkit-focus-ring-color;
  outline-color: #f4f4f4;
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
  max-height: 90vh;
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