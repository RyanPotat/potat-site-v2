<script setup>
import JoinButton from './components/joinButton.vue'
import loginButton from './components/loginButton.vue'
</script>

<template>
  <div class="app-container">
    <div class="background"></div>
      <div class="title-box">    
        <div class='title-container'>
          <img src="/tatoExplode.gif" class="logo"/>
          <a> 
            <h1>PotatBotat</h1>
            <h2>A twitch chatbot with no unique features</h2>
          </a>
          <div class="login-button-container">
            <loginButton/>
          </div>
        </div>
    </div>
    <div class="join-box">    
        <JoinButton/>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: row; /* Change to row */
  align-items: center;
  justify-content: center;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/Home.png');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.title-container {
  display: flex;
  align-items: center;
}

.title-box {
  background-color: rgba(31, 31, 31, 0.8);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  position: relative;
  margin-right: 300px;
}

.join-box {
  background-color: rgba(31, 31, 31, 0.8);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  position: relative;
  top: 50;
  right: 0;
  transform: scale(1.5); 
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.title-container h1 {
  align-self: flex-end;
}


.login-button-container {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
}

.join-button-container {
  height: 100vh; 
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
