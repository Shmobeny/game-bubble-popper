<script setup>
  import { ref, inject, watch } from 'vue';
  import Button from './Button.vue';
  
  const state = inject("state");
  const localization = inject("localization");

  const currentLocalization = ref(state.global.localization);
  const theme = ref(state.global.theme);
  const difficulty = ref(state.global.difficulty);

  function handleAnnotationClick(e) {
    e.target.classList.toggle("options__annotation--active");
  }

  watch(currentLocalization, (e) => {
    if (localization.value === state.global.localization) return;
    state.changeLocalizationTo(currentLocalization.value);
  });

  watch(() => state.global.localization, (e) => {
    currentLocalization.value = state.global.localization;
  });

  watch(theme, (e) => {
    if (theme.value === state.global.theme) return;
    state.changeThemeTo(theme.value);
  });

  watch(() => state.global.theme, (e) => {
    theme.value = state.global.theme;
  });

  watch(difficulty, (e) => {
    if (difficulty.value === state.global.difficulty) return;
    state.changeDifficultyTo(difficulty.value);
  });

  watch(() => state.global.difficulty, (e) => {
    difficulty.value = state.global.difficulty;
  });
</script>

<template>
  <div class="state options" :style="{ fontFamily: localization.fonts[state.global.localization]}">
    <h2 style="margin: 20px;">{{ localization.options.header[currentLocalization] }}</h2>
    
    <div class="items">

      <!-- LOCALIZATION -->
      <div class="options__item">
        <label for="localization">{{ localization.options.language[currentLocalization] }}: </label>
        <div class="options__interactive">
          <select name="localization" id="localization" v-model="currentLocalization" :style="{ fontFamily: localization.fonts[state.global.localization]}">
            <option value="eng" :selected="state.global.localization === 'eng'" :style="{ fontFamily: localization.fonts.eng }">English</option>
            <option value="ua" :selected="state.global.localization === 'ua'" :style="{ fontFamily: localization.fonts.ua }">Українська</option>
            <option value="ru" :selected="state.global.localization === 'ru'" :style="{ fontFamily: localization.fonts.ru }">Русский</option>
          </select>
        </div>
      </div>

      <!-- THEME -->
      <div class="options__item">
        <label for="theme">{{ localization.options.theme.label[currentLocalization] }}: </label>
        <div class="options__interactive">
          <select name="theme" id="theme" v-model="theme" :style="{ fontFamily: localization.fonts[state.global.localization]}">
            <option value="Dark" :selected="state.global.theme === 'Dark'">{{ localization.options.theme.value[currentLocalization][0] }}</option>
            <option value="White" :selected="state.global.theme === 'White'">{{ localization.options.theme.value[currentLocalization][1] }}</option>
          </select>
        </div>
      </div>

      <!-- DIFFICULTY -->
      <div class="options__item">
        <label for="difficulty">{{ localization.options.difficulty.label[currentLocalization] }}: </label>
        <div class="options__interactive">
          <select name="difficulty" id="difficulty" v-model="difficulty" :style="{ fontFamily: localization.fonts[state.global.localization]}">
            <option value="Easy" :selected="state.global.difficulty === 'Easy'">{{ localization.options.difficulty.value[currentLocalization][0] }}</option>
            <option value="Normal" :selected="state.global.difficulty === 'Normal'">{{ localization.options.difficulty.value[currentLocalization][1] }}</option>
            <option value="Hard" :selected="state.global.difficulty === 'Hard'">{{ localization.options.difficulty.value[currentLocalization][2] }}</option>
            <option value="Custom" :selected="state.global.difficulty === 'Custom'">{{ localization.options.difficulty.value[currentLocalization][3] }}</option>
          </select>
        </div>
      </div>

      <div class="options__item">
        <span class="options__annotation" @click="handleAnnotationClick">{{ localization.options.annotations.difficulty[currentLocalization] }}</span>
      </div>

      <!-- INITIAL VELOCITY -->
      <div class="options__item">
        <label for="initial-velocity">{{ localization.options.initialVelocity[currentLocalization] }}: </label>
        <div class="options__interactive">
          <input type="number" name="initial-velocity" id="initial-velocity" :disabled="state.global.difficulty !== 'Custom'" :min="1" :value="state.global.initialVelocity" @change="e => state.customizeDifficulty('Initial Velocity', +e.target.value, e)">
        </div>
      </div>

      <!-- MAX VELOCITY -->
      <div class="options__item">
        <label for="max-velocity">{{ localization.options.maxVelocity[currentLocalization] }}: </label>
        <div class="options__interactive">
          <input type="number" name="max-velocity" id="max-velocity" :disabled="state.global.difficulty !== 'Custom'" :min="1" :value="state.global.maxVelocity" @change="e => state.customizeDifficulty('Max Velocity', +e.target.value, e)">
        </div>
      </div>

      <div class="options__item">
        <span class="options__annotation" @click="handleAnnotationClick">{{ localization.options.annotations.velocity[currentLocalization] }}</span>
      </div>

      <!-- INITIAL PAUSE -->
      <div class="options__item">  
        <label for="initial-pause">{{ localization.options.initialPause[currentLocalization] }}: </label>
        <div class="options__interactive">
          <input type="number" name="initial-pause" id="initial-pause" :disabled="state.global.difficulty !== 'Custom'" :min="0" :value="state.global.pauseBetween" @change="e => state.customizeDifficulty('Pause Between', +e.target.value, e)">
        </div>
      </div>

      <!-- MIN PAUSE -->
      <div class="options__item">
        <label for="min-pause">{{ localization.options.minPause[currentLocalization] }}: </label>
        <div class="options__interactive">
          <input type="number" name="min-pause" id="min-pause" :disabled="state.global.difficulty !== 'Custom'" :min="0" :value="state.global.minimalPauseBetween" @change="e => state.customizeDifficulty('Min Pause Between', +e.target.value, e)">
        </div>
      </div>

      <div class="options__item">
        <span class="options__annotation" @click="handleAnnotationClick">{{ localization.options.annotations.pause[currentLocalization] }}</span>
      </div>

      <!-- BUBBLE LIMIT -->
      <div class="options__item">
        <label for="bubble-limit">{{ localization.options.bubbleLimit[currentLocalization] }}: </label>
        <div class="options__interactive">
          <input tabindex="-1" type="range" name="bubble-limit" id="bubble-limit" :disabled="state.global.difficulty !== 'Custom'" min="2" max="6" step="2" :value="state.bubbles.limit">
          <div
            class="limit-placeholder"
            :style="state.bubbles.limit === 2 ? { left: '0', transform: 'translateX(0%)' } : state.bubbles.limit === 4 ? {left: '50%', transform: 'translateX(-50%)'} : {left: '100%', transform: 'translateX(-100%)'}"
          >
            <span :class="state.global.difficulty === 'Custom' ? 'limit-value' : 'limit-value limit-value--disabled'">{{ state.bubbles.limit }}</span>
          </div>
          <input class="range--transparent" type="range" name="bubble-limit" id="bubble-limit" :disabled="state.global.difficulty !== 'Custom'" min="2" max="6" step="2" :value="state.bubbles.limit" @input="(e) => state.customizeDifficulty('Bubble Limit', +e.target.value)">
        </div>
      </div>

      <div class="options__item">
        <span class="options__annotation" @click="handleAnnotationClick">{{ localization.options.annotations.bubbleLimit[currentLocalization] }}</span>
      </div>

      <!-- RANDOM EXHIBITOR -->
      <div class="options__item">
        <label>{{ localization.options.randomExhibitor[currentLocalization] }}: </label>
        <div class="options__interactive">
          <input type="checkbox" name="difficulty-mod" id="difficulty-mod" :disabled="state.global.difficulty !== 'Custom'" :checked="state.global.randomDifficultyExhibitor" @change="state.toggleRandomExhibitor">
        </div>
      </div>

      <div class="options__item">
        <span class="options__annotation" @click="handleAnnotationClick">{{ localization.options.annotations.randomExhibitor[currentLocalization] }}</span>
      </div>

      <!-- Exhibitor Intensivity -->
      <div class="options__item">
        <label for="exhibitor">{{ localization.options.exhibitorIntensivity[currentLocalization] }}: </label>
        <div class="options__interactive">
          <input type="number" name="exhibitor" id="exhibitor" :disabled="state.global.randomDifficultyExhibitor || state.global.difficulty !== 'Custom'" min="0" :value="state.global.exhibitorIntensivity" @change="(e) => state.changeExhibitorIntensivity(e.target.value)">
        </div>
      </div>

      <div class="options__item">
        <span class="options__annotation" @click="handleAnnotationClick">{{ localization.options.annotations.exhibitorIntensivity[currentLocalization] }}</span>
      </div>

    </div>

    <Button style="margin: 20px;" @click="state.changePageTo('MainMenu')">{{ localization.options.button[currentLocalization] }}</Button>
  </div>
</template>

<style scoped>
  .options {
    justify-content: space-between;
    padding: 40px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  input, select {
    box-sizing: border-box;
    width: 100%;
    min-width: 110px;
    max-width: 110px;
    height: 100%;
    min-height: 28px;
    color: rgba(0, 0, 0, 1);
    font-size: 20px;
    font-family: 'Bebas Neue', cursive;
    /* font-family: 'Oswald', sans-serif; */
    background-color: rgba(240, 248, 255, 1);
    border: 1px solid black;
    border-radius: 5px;
    opacity: 1;
    transition: all 0.4s ease-in-out;
    text-align: center;
    cursor: pointer;
  }

  input[type="range"],
  .range--transparent {
    margin: 0;
    cursor: pointer;
  }

  .range--transparent {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  input[type="range"]:not(.range--transparent):disabled {
    opacity: 0.5;
  }

  input:disabled {
    color: rgba(0, 0, 0, 0.7);
    background-color: rgba(240, 248, 255, 0.7);
    box-shadow: inset 0px 0px 5px 0px black;
    cursor: not-allowed;
  }

  input[type="range"],
  input[type="checkbox"] {
    box-shadow: unset
  }

  .options__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 300px;
    width: 100%;
    margin: 15px 0px;
    font-size: 20px;
    text-align: left;
  }

  .options__annotation {
    position: relative;
    padding-right: 25px;
    font-size: 15px;
    opacity: 0.5;
    transition: all 300ms ease-in-out;
    cursor: pointer;
  }

  .options__annotation::before {
    content: '🔍';
    position: absolute;
    top: 0%;
    left: 100%;
    transform: translateX(-100%);
  }

  .options__annotation--active {
    transform: scale(1.2);
    opacity: 1;
  }

  .options__annotation--active::before {
    content: '❌';
  }

  .options__interactive {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 110px;
    margin-left: 15px;
  }

  .limit-placeholder {
    position: absolute;
    top: 0;
    left: 50%;
    display: block;
    width: 28px;
    height: 28px;
    font-family: 'Bebas Neue', cursive;
    background-color: aliceblue;
    border-radius: 50%;
    box-shadow: 0px 0px 5px 2px black;
    transform: translateX(-50%);
    cursor: pointer;
  }

  .limit-value {
    position: absolute;
    top: 0;
    left: 50%;
    color: black;
    text-align: center;
    font-size: 24px;
    transform: translateX(-50%);
  }

  .limit-value--disabled {
    color: rgba(0, 0, 0, 0.5);
  }
</style>