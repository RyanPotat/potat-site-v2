<script setup lang="ts">
import JoinButton from '../components/joinButton.vue';
import PartnerList from '../components/partnerList.vue';
import StatsBox from '../components/statsBox.vue';
import TwitchChat from '../components/twitchChat.vue';
</script>

<template>

<div class="title-help-container">

  <div class="title-box">    
      <div> 
          <h1 class='paint'>
              <a href="https://twitch.tv/potatbotat">
                  <img src="/tatoExplode.gif" class="logo"/>
              </a>
              <span>PotatBotat</span>
          </h1>
          <h2>An emote, entertainment, and utility chatbot</h2>
      </div>
  </div>

  <div class="buttons-container">
      <JoinButton/>
  </div>

</div>

<div class="bottom-stuff">
    <TwitchChat/>

    <div class="stats-container">
        <PartnerList/>
        <StatsBox/>
    </div>
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
}

.title-help-container {
  display: flex;
  flex-wrap: wrap;
  user-select: none;
  align-items: center;
  justify-content: center;
}

.title-box {
  display: flex;
  flex-wrap: wrap;
  background-color: rgba(31, 31, 31, 0.8);
  border-radius: 15px;
  padding: 15px;
  margin: 30px;
}

.buttons-container {
  transform: scale(1.5);
  align-self: center;
  justify-content: center;
}

.bottom-stuff {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.stats-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  margin-top: 0px;
  margin-bottom: 10px;
}

h2 {
  margin-top: 0px;
  margin-bottom: 0px;
}

.logo {
  height: 80px;
  width: 80px;
  margin-right: 20px;
}

@media (max-width: 600px) {
  .title-box {
    transform: scale(0.9);
    margin-top: 120px;
  }

  .stats-container {
    transform: scale(0.8);
  }

}
</style>
