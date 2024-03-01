<script setup lang="ts">
const openPage = () => {
  window.open('https://api.potat.app/help','_blank');
};
</script>

<template>
  <div class="button-box">
    <button class="help-button" type="button" @click="openPage">Help</button>
  </div>
</template>

<style scoped>
.button-box {
  background-color: rgba(31, 31, 31, 0.8);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  user-select: none;
  top: 50;
  right: 0;
  transform: scale(1.5); 
  margin-bottom: 20px;
}
.help-button {
  border-radius: 8px;
  border: 2px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
  text-shadow: -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333;
  background-color: rgb(255, 255, 0);
}

.help-button:hover {
  border-color: #fdfdfd;
}

.help-button:focus,
.help-button:focus-visible {
  outline: 8px auto -webkit-focus-ring-color;
}

</style>
