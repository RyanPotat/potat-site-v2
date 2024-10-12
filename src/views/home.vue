<script setup lang="ts">
import JoinButton from '../components/joinButton.vue';
import PartnerList from '../components/partnerList.vue';
import StatsBox from '../components/statsBox.vue';
import TwitchChat from '../components/twitchChat.vue';
</script>

<template>

<div class="home-container">
	<div class="potat-home">
		<div class="title-box">
			<h1 class='paint'>
				<a href="https://twitch.tv/potatbotat">
					<img src="/tatoExplode.gif" class="logo"/>
				</a>
				<span>PotatBotat</span>
			</h1>
			<h2>An emote, entertainment, and utility chatbot</h2>
		</div>
	</div>
	<div class="join-container">
  	<JoinButton/>
	</div>

	<TwitchChat/>

	<div class="widgets-container">
		<PartnerList/>
		<StatsBox/>
	</div>
</div>

</template>

<style scoped>
/** vegas https://cdn.7tv.app/misc/img_paints/tc23lasvegas.webp */
/** rotterdam https://cdn.7tv.app/emote/667c887f387822a16b8f57ed/3x.webp */

.home-container {
	display: grid;
	grid-template-columns: auto auto 340px;
	grid-template-rows: auto 1fr;
	gap: 8px 20px;
	padding: 10px;
}
.potat-home {
	grid-area: 1 / 1 / 2 / 1;
	margin: 20px;
}
.title-box {
  background-color: rgba(31, 31, 31, 0.8);
  border-radius: 15px;
  padding: 15px;
	text-align: center;
	margin: 0 auto;
	h2 {
		font-size: 22px;
		font-weight: 400;
	}
}
.paint span {
	font-size: 42px;
  background-image: url('https://cdn.7tv.app/emote/667c887f387822a16b8f57ed/3x.webp');
  filter: drop-shadow(#9d31a5 0px 0px 0.1px);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 100% auto;
}
.join-container {
	grid-area: 1 / 2 / 2 / 3;
	padding: 40px 0;
	text-align: center;
}
.twitch-iframe {
	grid-area: 1 / 3 / 3 / 4;
	min-width: 320px;
}
.widgets-container {
	grid-area: 2 / 1 / 3 / 3;
	display: flex;
	justify-content: space-around;
	align-items: start;
	flex-wrap: wrap;
	gap: 8px;
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

@media (max-width: 960px) {
	.home-container {
		grid-template-columns: 1fr 2fr;
	}
	.potat-home {
		grid-area: 1 / 1 / 2 / 3;
	}
	.join-container {
		grid-area: 2 / 1 / 3 / 3
	}
	.twitch-iframe {
		grid-area: 3 / 2 / 4 / 3;
	}
	.widgets-container {
		grid-area: 3 / 1 / 4 / 2;
	}
	.join-container {
		padding: 0;
		button {
			width: 90% !important;
		}
	}
}
@media (max-width: 640px) {
  .home-container {
		display: flex;
		flex-direction: column;
	}
}
</style>
