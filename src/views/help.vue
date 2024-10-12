<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { humanizeDuration } from '../assets/utilities';
import { Command, KeyString } from '../types/help';
import router from '../router';
import { useRoute } from 'vue-router';
const route = useRoute();

enum InternalLevels {
  'Blacklisted',
  'Standard users',
  'Bot moderators',
  'Bot admins',
  'Bot developers',
};

const isAllCommands = computed(() => !route.params.command);

const prefCategorySort = [
	'emotes',
	'potato',
	'settings',
	'stream',
	'utilities',
	'moderation',
	'spam',
	'fun',
	'anime',
	'development',
	'deprecated',
]

const

permissions: KeyString = {
  'NONE': 'No Permissions',
  'SUBSCRIBER': 'Subscriber',
  'VIP': 'VIP',
  'MOD': 'Moderator',
  'AMBASSADOR': 'Ambassador',
  'BROADCASTER': 'Broadcaster',
},

botPerms: KeyString = {
  'MOD': 'Moderator',
  'VIP': 'VIP'
},

changeCommand = (command: Command) => {
	router.push({ path: `/help/${command.name}` })
  selectedCommand.value = command.name;
},

checkArray = (arr: string[] | undefined) => {
  return arr && arr.length && arr.some(a => a.trim() !== '')
},

categories = computed(() => {
  return [...new Set(commands.value.map(command => command.category).sort((a, b) => {
			const ap = prefCategorySort.indexOf(a);
			const bp = prefCategorySort.indexOf(b);

			return ap - bp;
		}))].filter(each => {
    if (!Boolean(each)) return false;

    const filtered = filteredCommands.value.filter(command => command.category === each)
    if (filtered.length === 0) return false;
    return true;
  });
}),

getCategory = computed(() => {
	return new Map<string, Command[]>(
		categories.value
			.map(category => [category, filteredCommands.value.filter(command => command.category === category)])
	);
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
      command.aliases.some(alias => alias.toLowerCase().includes(query)) ||
      command.description.toLowerCase().includes(query) ||
      command.title.toLowerCase().includes(query))
    );
  });
});


onMounted(() => {
	fetch('https://api.potat.app/help')
		.then(res => res.json())
		.then((data) => {
			commands.value = data;

			if (route?.params?.command) {
				const cmd = commands.value.find(command => command.name === route.params.command)

				if (cmd) {
					selectedCommand.value = cmd.name;
				}
			}
		})
		.catch(console.error);
});
</script>

<template>
  <div v-if="commands.length > 0" id="help-container">
    <div :class="{ 'sidebar-container': true, 'hidden-mobile': !isAllCommands }">
			<div class="search-container">
				<input v-model="search" type="text" placeholder="Search..." class="search"/>
			</div>
      <nav class="sidebar">
        <section v-for="category in categories" :key="category">
          <h3>{{ category }}</h3>
					<ul class="commands-list">
						<li @click="changeCommand(command)" v-for="command in getCategory.get(category)" :key="command.name" class="command-item">
							<a :class="{ active: command.name === selectedCommand }"><span class="command-prefix">#</span>{{ command.name }}</a>
						</li>
					</ul>
				</section>
      </nav>
    </div>
    <div v-if="getCommand" :class="{ 'help-content': true, 'hidden-mobile': isAllCommands }">
			<div class="command-info">
				<nav class="command-nav">
					<button class="visible-mobile all-commands">
						<router-link to="/help">All Commands</router-link>
					</button>
					<h2 class="command-title">{{ getCommand.title }}</h2>
				</nav>
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
							<strong>Cooldown: </strong>{{ humanizeDuration(getCommand.cooldown) }}
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
.visible-mobile {
	display: none;
}
.search {
	font-size: 18px;;
	width: 100%;
  padding: 10px;
  border-radius: 5px;
  outline: auto -webkit-focus-ring-color;
  outline-color: #f4f4f4;
  color: white;
}
.search-container {
	background-color: rgba(31, 31, 31, 1);
	width: 100%;
	position: sticky;
	top: 0;
	z-index: 10;
}
#help-container {
	display: grid;
	grid-template: auto / 250px 1fr;
	gap: 36px;
	padding: 10px;
}
.sidebar {
	position: sticky;
	top: 80px;
	height: 80vh;
	overflow-y: auto;
	overflow-x: hidden;
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

.command-prefix {
	color: #ccc;
	padding-right: 1px;
}
.command-details {
  background-color: #1a1a1a;
  border-radius: 15px;
  padding: 20px;
  background-color: rgba(31, 31, 31, 0.906);
  text-align: left;
  overflow-y: auto;
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
.sidebar {
  display: flex;
  flex-direction: column;
	background-color: rgba(31, 31, 31, 0.906);
	section {
		border-bottom: 1px solid white;
		padding: 15px;
	}
	h3 {
		font-size: 16px;
	}
}
.commands-list {
	margin: 0;
	padding: 0;
	list-style: none;
}
.command-item {
	margin: 10px 0;
	cursor: pointer;
	font-size: 18px;
	margin: 14px 0;
	padding: 8px;
}
.command-item a.active {
	color: #ae81ff
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

@media (max-width: 640px) {
	#help-container {
		display: flex;
	}
	#help-container > div {
		width: 100%;
		flex: 1;
	}
	.sidebar {
		height: auto;
	}
	.visible-mobile {
		display: block;
	}
	.hidden-mobile {
		display: none;
	}
	.command-nav {
		background-color: rgba(31, 31, 31, 0.906);
		position: sticky;
		padding: 15px;
		margin-bottom: 5px;
		position: sticky;
		top: 80px;
	}
	.all-commands {
		font-size: 20px;
	}
	.command-item {
		font-size: 20px;
	}
	.command-title {
		outline: none;
		font-size: 22px;
	}
	.search-container {
		top: 80px;
	}
	#help-content {
		padding-top: 20px;
	}
}
</style>
