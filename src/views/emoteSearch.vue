<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { fetchBackend } from '../assets/request';


interface Emote {
    id: string;
    name: string;
    format: string;
    url: string;
}

interface SearchOptions {
    approach: 'matches' | 'starts' | 'includes' | 'ends';
    format: 'static' | 'animated' | 'any';
    case: boolean;
    cursor: string | null;
}

let observer: IntersectionObserver;

const approach = ref<SearchOptions['approach']>('starts');
const caseSensitive = ref<SearchOptions['case']>(false);
const format = ref<SearchOptions['format']>('any');
const emoteList = ref<HTMLElement | null>(null);
const cursor = ref<string | null>(null);
const searchQuery = ref<string>('');
const emotes = ref<Emote[]>([]);
const isRequesting = ref(false);

const searchEmotes = async (query: string, options: SearchOptions): Promise<Emote[]> => {
  if (isRequesting.value) return [];

  isRequesting.value = true;

  const response = await fetchBackend<Emote>(`twitch/emotes/search`, {
    params: {
      [options?.approach]: query,
      case: String(options?.case === true),
      format: options?.format && options?.format !== 'any' ? options?.format : null,
      first: 200,
      after: options.cursor
    }
  }).finally(() => {
    isRequesting.value = false;
  });

  console.log(response)

  if (response.errors?.length) {
    console.error(response.errors);
    return [];
  }

  console.log(response.pagination);

  if (response.pagination?.hasNextPage) {
    cursor.value = response.pagination.cursor;
  }

  return response?.data ?? [];
}

const onQuery = async () => {
  const options: SearchOptions = {
    approach: approach.value,
    format: format.value,
    case: caseSensitive.value,
    cursor: cursor.value
  }

  const thisBatch = await searchEmotes(searchQuery.value, options).then(res => {
    return res.filter(each => !emotes.value.some(e => e.id === each.id));
  })

  emotes.value.push(...thisBatch);
}

const onNewQuery = async () => {
  emotes.value = [];
  cursor.value = null;
  onQuery();
}

const handleScroll = () => {
  if (!emoteList.value) return;
  const { scrollTop, scrollHeight, clientHeight } = emoteList.value;

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    onQuery();
  }
};



const observeImages = () => {
  const options = {
    root: emoteList.value,
    rootMargin: '0px',
    threshold: 0.1
  };

  observer = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src as string;
        observer.unobserve(img);
      }
    }
  }, options);

  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => {
    observer.observe(img);
  });
}

watch(emotes, async () => {
  await nextTick();
  observeImages();
});

</script>

<template>
  <div id="container">
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search emotes..."
        @keydown.enter="onNewQuery"
        class="search-box"
      />
      <select v-model="approach" class="search-box">
        <option value="matches">Matches</option>
        <option value="starts">Starts</option>
        <option value="includes">Includes</option>
        <option value="ends">Ends</option>
      </select>
      <select v-model="format" class="search-box">
        <option value="any" selected>Any</option>
        <option value="static">Static</option>
        <option value="animated">Animated</option>
      </select>
      <label>
        Case Sensitive
        <input type="checkbox" v-model="caseSensitive"  class="search-box"/>
      </label>
      <button @click="onNewQuery" >Search</button>
    </div>
    <div class="emote-list" ref="emoteList" @scroll="handleScroll">
      <div v-for="emote in emotes" :key="emote.id" class="emote">
        <img :src="emote.url" :alt="emote.name" />
        <span>{{ emote.name }}</span>
      </div>
    </div>
  </div>
</template>


<style scoped>

#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;
  width: 100%;
}

.search-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-width: fit-content;
  gap: 10px;
  margin-bottom: 20px;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: rgba(31, 31, 31, 0.94);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.search-bar input[type="text"] {
  padding: 5px;
  font-size: 1rem;
}

.search-bar select, .search-bar label {
  padding: 5px;
  font-size: 1rem;
}

.emote-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  overflow-y: auto;
  max-height: 80vh;
  width: 99vw;
  margin-left: 10px;
  margin-right: 10px;
}

.search-box {
  padding: 10px;
  border-radius: 15px;
  background-color: rgba(31, 31, 31, 0.906);
  outline: auto -webkit-focus-ring-color;
  outline-color: #f4f4f4;
  color: white;
}

.emote {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(31, 31, 31, 0.94);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 3px;
  border-radius: 0.5rem;
  font-size: 12px;
}

.emote img {
  max-width: 80px;
  max-height: 80px;
}
</style>
