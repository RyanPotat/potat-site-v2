<script setup lang="ts">

</script>

<template>
    <div class="twitch-iframe" style="flex-direction: column;">
        <h2>Ask for help, or try it out!</h2>
        
        <iframe id="twitch-chat-embed"
          src="https://www.twitch.tv/embed/potatbotat/chat?parent=potat.app&darkpopout"
          height="500"
          width="350"
          style="border-radius: 15px; overflow: hidden;">
        </iframe>
    </div>
</template>

<style scoped>
  .twitch-iframe {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    background-color: rgba(31, 31, 31, 0.8);
    border-radius: 15px;
    padding: 15px;
  }

  iframe#twitch-chat-embed {
    display: flex;
    border: none;
    flex-wrap: wrap;
  }
</style>