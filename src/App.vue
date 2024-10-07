<script setup lang="ts">
import LoginButton from './components/loginButton.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { StatsSocket } from './assets/socket';

StatsSocket.new('wss://stats.potat.app');

const isDropdownVisible = ref(false);
const windowWidth = ref(window.innerWidth);

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
  const display = isDropdownVisible.value ? 'block' : 'none';
  document.querySelector('.dropdown-content')?.setAttribute('style', `display: ${display}`);
};

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});
</script>

<template>
  <div id="app">
    <div class="top-bar">
      <strong><router-link to="/" class="nav-link">Home</router-link></strong>
      <strong><router-link to="/help" class="nav-link">Commands</router-link></strong>

      <div v-if="windowWidth < 600">
        <strong class="nav-link" @click="toggleDropdown">More</strong>
        <div class="dropdown-content">
          <strong><router-link to="/leaderboard" class="nav-link">Leaderboards</router-link></strong>
          <a href="/emotes/search" class="nav-link">Emote Search</a>
          <a href="https://haste.potat.app" class="nav-link external-link">Haste</a>
          <a href="/redirects" class="nav-link external-link">URL Shortener</a>
          <a href="/api/docs" class="nav-link">API Docs</a>
        </div>
      </div>
      <div v-else>
        <strong><router-link to="/leaderboard" class="nav-link">Leaderboards</router-link></strong>
        <strong class="nav-link" @click="toggleDropdown">Tools</strong>
        <div class="dropdown-content">
          <a href="/connections" class="nav-link">Connections</a>
          <a href="/emotes/search" class="nav-link" style="margin-bottom: 10px;">Emote Search</a>
          <a href="https://haste.potat.app" class="nav-link external-link" style="margin-bottom: 10px;">Haste</a>
          <a href="/redirects" class="nav-link external-link" style="margin-bottom: 10px;">URL Shortener</a>
          <a href="/api/docs" class="nav-link">API Docs</a>
        </div>
      </div>
      <div class="login-button-container"><LoginButton/></div>
    </div>

    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-image: url('/Home.png');
  background-size: cover;
  background-position: center;
}

.top-bar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(31, 31, 31, 0.8);
  padding: 10px;
  display: flex;
  align-items: center;
  z-index: 10;
  user-select: none;
}

.nav-link {
  margin-left: 10px;
  padding: 12px;
  outline: auto -webkit-focus-ring-color;
  outline-color: #f4f4f4;
  border-radius: 15px;
  transition: background-color 0.3s ease;
  color: inherit;
  cursor: pointer;
  position: relative; 
}

.nav-link.router-link-active {
  background-color: #6441a4;
  color: #fff;
}

.external-link {
  text-decoration: none;
}

.main-container {
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  margin-top: 60px;
  overflow: auto;
  overflow-x: hidden;
}

.login-button-container {
  margin-left: auto;
  margin-right: 10px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: rgba(31, 31, 31, 0.9);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  margin-top: 20px;
  padding: 12px;
  border-radius: 15px;
}

.dropdown-content .nav-link {
  display: block;
  margin-right: 0;
  padding: 12px;
  white-space: nowrap;
}

@media (max-width: 650px) {
  .more-dropdown {
    display: flex;
    align-items: center;
  }

  .more-dropdown .nav-link {
    margin-left: 5px;
  }

  .dropdown-content {
    position: relative;
  }
}
</style>
