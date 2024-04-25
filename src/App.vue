<script setup lang="ts">
import LoginButton from './components/loginButton.vue';
import { StatsSocket } from './assets/socket';

StatsSocket.new('wss://stats.potat.app')
</script>

<template>
  <div id="app">
    <div class="top-bar">
      <strong><router-link to="/" class="nav-link">Home</router-link></strong>
      <strong><router-link to="/leaderboard" class="nav-link">Leaderboard</router-link></strong>
      <!-- <strong>
        <router-link to="/channel/:username" class="nav-link">Channel</router-link>
      </strong> -->
      <strong><router-link to="/help" class="nav-link">Commands</router-link></strong>
      <strong><a href="https://haste.potat.app" class="nav-link external-link">Haste</a></strong>
      <div class="login-button-container">
        <LoginButton/>
      </div>
    </div>

    <div class="main-background"></div>
    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>

.top-bar {
  position: absolute;
  top: 0;
  width: 100%;
  color: #fff;
  background-color: rgba(31, 31, 31, 0.8);
  padding: 20px;
  display: flex;
  z-index: 1;
  user-select: none;
  margin-left: 40px;
}

.nav-link {
  margin-right: 20px;
  padding: 12px;
  outline: auto -webkit-focus-ring-color;
  outline-color: #f4f4f4;
  border-radius: 15px;
  transition: background-color 0.3s ease;
}

.nav-link.router-link-active {
  background-color: #6441a4;
  color: #fff;
}

.external-link {
  text-decoration: none;
}

.main-container {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}

.main-background {
  position: fixed;
  width: 100%;
  height: 100%;
  background-image: url('/Home.png');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.login-button-container {
  margin-left: auto;
  margin-right: 35px;
  margin-top: -12px;
  margin-bottom: -12px
}
</style>