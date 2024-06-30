<script setup lang="ts">
import JoinButton from '../components/joinButton.vue';
import PartnerList from '../components/partnerList.vue';
import StatsBox from '../components/statsBox.vue';
</script>

<template>
    <div class="title-help-container">
      <div class="title-box">    
        <a href="https://twitch.tv/potatbotat">
        <img src="/tatoExplode.gif" class="logo"/>
        </a>
        <a> 
          <h1 class='paint'>
            <span>PotatBotat</span>
          </h1>
          <h2>A twitch chatbot with no unique features</h2>
        </a>
      </div>
      <div class="buttons-container">
        <JoinButton/>
      </div>
    </div>
    <div class="stats-container">
      <PartnerList/>
      <StatsBox/>
    </div>
</template>

<style scoped>
/** vegas https://cdn.7tv.app/misc/img_paints/tc23lasvegas.webp */
/** rotterdam https://cdn.7tv.app/emote/667c887f387822a16b8f57ed/3x.webp */

.paint span {
  background-image: url('https://cdn.7tv.app/emote/667c887f387822a16b8f57ed/3x.webp');
  filter: drop-shadow(#9d31a5 0px 0px 0.1px);
  -webkit-background-clip: text; 
  background-clip: text;
  color: transparent;
  background-size: 100% auto;
  margin-right: 150px;
}

.title-help-container {
  display: flex;
  user-select: none;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.title-box {
  background-color: rgba(31, 31, 31, 0.8);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  position: relative;
  margin-right: 150px;
  margin-bottom: 20px;
}

.buttons-container {
  margin-left: 20px; 
}

.stats-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

h1 {
  margin-bottom: 0px;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

</style>
