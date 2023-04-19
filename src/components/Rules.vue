<script setup>
  import { inject } from 'vue';
  import Button from './Button.vue';
  
  const state = inject("state");
  const localization = inject("localization");
</script>

<template>
  <div class="state rules" :style="{ fontFamily: localization.fonts[state.global.localization]}">
    <h2 style="margin: 40px;">{{ localization.rules.header[state.global.localization] }}</h2>
    
    <div>
      <p>{{ localization.rules.mainText[state.global.localization] }}</p>
      
      <h3>{{ localization.rules.bubble.header[state.global.localization] }}</h3>
      <p>{{ localization.rules.bubble.text[state.global.localization] }}</p>
      
      <h3>{{ localization.rules.multiplier.header[state.global.localization] }}</h3>
      <p>{{ localization.rules.multiplier.text[state.global.localization] }}</p>
      
      <h3>{{ localization.rules.score.header[state.global.localization] }}</h3>
      <p>{{ localization.rules.score.text[state.global.localization] }}</p>

      <h3>{{ localization.rules.difficulty.header[state.global.localization] }}</h3>
      <p>{{ localization.rules.difficulty.text[state.global.localization] }}</p>
      
      <h3>{{ localization.rules.endgame.header[state.global.localization] }}</h3>
      <p>{{ localization.rules.endgame.text[state.global.localization] }}</p>
    </div>
    
    <Button style="margin: 40px;" @click="state.changePageTo('MainMenu')">{{ localization.rules.button[state.global.localization] }}</Button>
  </div>
</template>

<style scoped>
  .rules {
    justify-content: space-between;
    padding: 40px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  h3 {
    text-align: left;
    font-size: 25px;
    margin: 0;
  }

  p {
    text-align: left;
    max-width: 600px;
    font-family: 'Roboto', sans-serif;
    text-align: left;
  }
</style>