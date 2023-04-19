<script setup>
  import { computed, inject, ref, watch } from 'vue';

  const state = inject("state");
  const localization = inject("localization");
  
  const props = defineProps(["multiplier", "score", "condition"]);

  const themeCSS = computed(() => 'info info--theme-' + state.global.theme.toLowerCase());

  const countdownSwitcher = ref(true);
  const multiplierSwitcher = ref(true);
  const scoreSwitcher = ref(true);

  watch(() => state.global.countdownResume, () => countdownSwitcher.value = !countdownSwitcher.value);
  watch(() => props.multiplier, () => multiplierSwitcher.value = !multiplierSwitcher.value);
  watch(() => props.score, () => scoreSwitcher.value = !scoreSwitcher.value);
</script>

<template>
  <div :class="themeCSS" :style="{ fontFamily: localization.fonts[state.global.localization]}">
    <div class="info__multiplier">
      <div class="label label--multiplier">{{ localization.game.labels.multiplier[state.global.localization] }}</div>
      <Transition name="slide-multiplier" mode="out-in">
        <span style="width: 100;" v-if="state.global.gamePaused">{{ localization.game.pause[state.global.localization][0] }}</span>
        <span style="width: 100; font-size: 50px;" v-else-if="state.global.gameResuming">{{ localization.game.resume[state.global.localization] }}</span>
        <span style="width: 100; font-family: 'Bebas Neue', cursive;" v-else-if="multiplierSwitcher && !state.global.gameEnded">{{ props.multiplier.toFixed(2) }}</span>
        <span style="width: 100; font-family: 'Bebas Neue', cursive;" v-else-if="!multiplierSwitcher && !state.global.gameEnded">{{ props.multiplier.toFixed(2) }}</span>
        <span style="width: 100;" v-else>{{ localization.game.lose[state.global.localization][0] }}</span>
      </Transition>
    </div>
    <div class="info__score">
      <div class="label label--score">{{ localization.game.labels.score[state.global.localization] }}</div>
      <Transition name="slide-score" mode="out-in">
        <span style="width: 100;" v-if="state.global.gamePaused">{{ localization.game.pause[state.global.localization][1] }}</span>
        <span style="width: 100; font-family: 'Bebas Neue', cursive;" v-else-if="state.global.gameResuming && countdownSwitcher">{{ state.global.countdownResume }}</span>
        <span style="width: 100; font-family: 'Bebas Neue', cursive;" v-else-if="state.global.gameResuming && !countdownSwitcher">{{ state.global.countdownResume }}</span>
        <span style="width: 100; font-family: 'Bebas Neue', cursive;" v-else-if="scoreSwitcher && !state.global.gameEnded">{{ props.score }}</span>
        <span style="width: 100; font-family: 'Bebas Neue', cursive;" v-else-if="!scoreSwitcher && !state.global.gameEnded">{{ props.score }}</span>
        <span style="width: 100;" v-else>{{ localization.game.lose[state.global.localization][1] }}</span>
      </Transition>
    </div>
  </div>
  <div class="placeholder" @click="() => state.global.gameIniciated ? state.toggleGamePause() : null">
    <Transition name="pause-resume" mode="out-in">
      <span v-if="!state.global.gamePaused && state.global.gameIniciated && ((props.condition.x !== 0 && props.condition.y !== 0) || state.bubbles.count > 1)" class="material-symbols-outlined">pause_circle</span>
      <span v-else-if="state.global.gamePaused && state.global.gameIniciated && ((props.condition.x !== 0 && props.condition.y !== 0) || state.bubbles.count > 1)" class="material-symbols-outlined">play_circle</span>
      <span v-else-if="state.global.gameEnded" style="margin-top: 5px;">{{ props.score }}</span>
    </Transition>
  </div>
</template>

<style scoped>
  .info {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 100px;
    text-align: center;
    white-space: nowrap;
    opacity: 0.5;
  }

  .info__multiplier {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    flex-basis: 50%;
  }

  .label {
    position: absolute;
    display: block;
    padding: 5px;
    font-size: 20px;
    color: black;
    background-color: white;
  }

  .label--multiplier {
    top: 100%;
    left: 0%;
    transform: translateY(-100%);
  }

  .label--score {
    top: 0%;
    left: 100%;
    transform: translateX(-100%);
  }

  .info__score {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    flex-basis: 50%;
    border-top: 2px solid white;
  }

  .placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    font-size: 45px;
    border-radius: 50%;
    background-color: black;
    transform: translate(-50%, -50%);
    overflow: hidden;
    cursor: pointer;
  }

  .material-symbols-outlined {
    font-size: 85px;
    text-shadow: 1px 1px 1px red,
                 -1px -1px 1px blue;
    transition: text-shadow 0.5s ease-in-out;
  }

  .placeholder:hover .material-symbols-outlined {
    text-shadow: 3px 3px 3px red,
                 -3px -3px 3px blue;
  }

  /* THEMES SETTINGS */
  .info--theme-dark {
    color: white;
    opacity: 0.5;
  }

  .info--theme-white {
    color: black;
    opacity: 0.6;
  }

  .info--theme-dark > .info__multiplier {
    border-bottom: 2px solid aliceblue;
  }

  .info--theme-white > .info__multiplier {
    border-bottom: 2px solid black;
  }

  .info--theme-dark .label--multiplier {
    color: black;
    background-color: aliceblue;
  }

  .info--theme-white .label--multiplier {
    color: aliceblue;
    background-color: black;
  }

  .info--theme-dark > .info__score {
    border-top: 2px solid aliceblue;
  }

  .info--theme-white > .info__score {
    border-top: 2px solid black;
  }

  .info--theme-dark .label--score {
    color: black;
    background-color: aliceblue;
  }

  .info--theme-white .label--score {
    color: aliceblue;
    background-color: black;
  }

  .info--theme-dark ~ .placeholder {
    color: aliceblue;
    border: 5px solid rgba(255, 255, 255, 0.5);
    background-color: black;
    box-shadow: inset 0px 0px 4px 0px aliceblue;
  }
  
  .info--theme-white ~ .placeholder {
    color: black;
    border: 5px solid rgba(0, 0, 0, 0.6);
    background-color: aliceblue;
    box-shadow: inset 0px 0px 4px 0px black;
  }
  /* --- */

  .slide-multiplier-enter-active,
  .slide-multiplier-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-multiplier-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }

  .slide-multiplier-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }

  .slide-score-enter-active,
  .slide-score-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-score-enter-from {
    opacity: 0;
    transform: translateX(-100%);
  }

  .slide-score-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }

  .pause-resume-enter-active,
  .pause-resume-leave-active {
    transition: all 0.15s ease-out;
  }

  .pause-resume-enter-from,
  .pause-resume-leave-to {
    transform: scale(0);
  }
</style>