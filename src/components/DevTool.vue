<script setup>
  import { ref, inject, watch } from 'vue';
  import Button from './Button.vue';

  const state = inject("state");
  const opacity = ref(100);
  const hidden = ref(true);
  const navigator = ref(state.global.currentPage);
  const localization = ref(state.global.localization);
  const theme = ref(state.global.theme);
  const difficulty = ref(state.global.difficulty);

  watch(navigator, (e) => {
    if (navigator.value === state.global.currentPage) return;
    state.changePageTo(navigator.value);
  });

  watch(() => state.global.currentPage, (e) => {
    navigator.value = state.global.currentPage;
  });

  watch(localization, (e) => {
    if (localization.value === state.global.localization) return;
    state.changeLocalizationTo(localization.value);
  });

  watch(() => state.global.localization, (e) => {
    localization.value = state.global.localization;
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
  <div :class="[state.global.devTool ? hidden ? 'dev-tool-wrapper dev-tool-wrapper--hidden' : 'dev-tool-wrapper' : 'dev-tool-wrapper dev-tool-wrapper--disabled']">
    <div class="dev-tool" :style="{opacity: opacity / 100}">
      <h2 class="dev-tool__title">DevTool</h2>
      <h3>Visibility</h3>
      <input type="range" min="20" max="100" v-model="opacity">

      <div class="dev-tool__item">
        <h3>Game Language</h3>
        <div>
          <label for="localization">Localization: </label>
          <select name="localization" id="localization" v-model="localization">
            <option value="eng" :selected="state.global.localization === 'eng'">English</option>
            <option value="ua" :selected="state.global.localization === 'ua'">Українська</option>
            <option value="ru" :selected="state.global.localization === 'ru'">Русский</option>
          </select>
        </div>
      </div>

      <div class="dev-tool__item">
        <h3>Game Theme</h3>
        <div>
          <label for="theme">Theme: </label>
          <select name="theme" id="theme" v-model="theme">
            <option value="Dark" :selected="state.global.theme === 'Dark'">Dark Theme</option>
            <option value="White" :selected="state.global.theme === 'White'">White Theme</option>
          </select>
        </div>
      </div>

      <div class="dev-tool__item">
        <h3>Game States</h3>

        <div>
          <label for="navigator">Current page: </label>
          <select name="navigator" id="navigator" v-model="navigator">
            <option value="MainMenu" :selected="state.global.currentPage === 'MainMenu'">Main Menu</option>
            <option value="GameField" :selected="state.global.currentPage === 'GameField'">Game Field</option>
            <option value="Options" :selected="state.global.currentPage === 'Options'">Options</option>
            <option value="Rules" :selected="state.global.currentPage === 'Rules'">Rules</option>
          </select>
        </div>

        <div>
          <span>Game Iniciated: {{ state.global.gameIniciated }}</span>
        </div>
        <div>
          <span>Game Ended: {{ state.global.gameEnded }}</span>
        </div>
        <div>
          <span>Game Paused: {{ state.global.gamePaused }}</span>
        </div>
        <div>
          <span>Game Resuming: {{ state.global.gameResuming }}</span>
        </div>
        <div>
          <span>Game Restarted: {{ state.global.gameRestarted }}</span>
        </div>
      </div>

      <div class="dev-tool__item">
        <h3>Actions</h3>
        <Button :disabled="state.global.currentPage === 'GameField' ? false : true" @click="state.iniciateGameStart">start</Button>
        <Button :disabled="state.global.currentPage === 'GameField' ? false : true" @click="state.toggleGamePause">{{state.global.gamePaused ? "resume" : "pause"}}</Button>
        <Button :disabled="state.global.currentPage === 'GameField' ? false : true" @click="state.iniciateGameRestart">restart</Button>
        <Button :disabled="state.global.currentPage === 'GameField' ? false : true" @click="state.iniciateGameOver">iniciate loose</Button>
        <Button :disabled="state.global.currentPage === 'GameField' ? false : true" @click="state.generateBubble(1)">Generate Bubble</Button>
        <Button :disabled="state.global.currentPage === 'GameField' ? false : true" @click="state.removeBubble(state.bubbles.items[state.bubbles.count - 1])">Remove Bubble</Button>
      </div>

      <div class="dev-tool__item">
        <h3>Values</h3>
        
        <div>
          <label for="difficulty">Difficulty: </label>
          <select name="difficulty" id="difficulty" v-model="difficulty">
            <option value="Easy" :selected="state.global.difficulty === 'Easy'">Easy</option>
            <option value="Normal" :selected="state.global.difficulty === 'Normal'">Normal</option>
            <option value="Hard" :selected="state.global.difficulty === 'Hard'">Hard</option>
            <option value="Custom" :selected="state.global.difficulty === 'Custom'">Custom</option>
          </select>
        </div>

        <div>
          <label for="difficulty-mod">Random Exhibitor: </label>
          <input type="checkbox" name="difficulty-mod" id="difficulty-mod" :checked="state.global.randomDifficultyExhibitor" @change="state.toggleRandomExhibitor">
        </div>

        <div>
          <label for="exhibitor">Exhibitor Intensivity: </label>
          <input type="number" name="exhibitor" id="exhibitor" :disabled="state.global.randomDifficultyExhibitor" min="0" :value="state.global.exhibitorIntensivity" @change="(e) => state.changeExhibitorIntensivity(e.target.value)">
        </div>

        <div>
          <label for="initial-velocity">Initial Velocity: </label>
          <input type="number" name="initial-velocity" id="initial-velocity" :disabled="state.global.difficulty !== 'Custom'" :min="1" :value="state.global.initialVelocity" @change="(e) => state.customizeDifficulty('Initial Velocity', +e.target.value, e)">
        </div>
        <div>
          <label for="initial-velocity">Max Velocity: </label>
          <input type="number" name="initial-velocity" id="initial-velocity" :disabled="state.global.difficulty !== 'Custom'" :min="1" :value="state.global.maxVelocity" @change="(e) => state.customizeDifficulty('Max Velocity', +e.target.value, e)">
        </div>
        <div>
          <label for="initial-velocity">Initial Pause: </label>
          <input type="number" name="initial-velocity" id="initial-velocity" :disabled="state.global.difficulty !== 'Custom'" :min="0" :value="state.global.pauseBetween" @change="(e) => state.customizeDifficulty('Pause Between', +e.target.value, e)">
        </div>
        <div>
          <label for="initial-velocity">Minimal Pause: </label>
          <input type="number" name="initial-velocity" id="initial-velocity" :disabled="state.global.difficulty !== 'Custom'" :min="0" :value="state.global.minimalPauseBetween" @change="(e) => state.customizeDifficulty('Min Pause Between', +e.target.value, e)">
        </div>

      </div>
    </div>
    <Button :class="[state.global.devTool ? hidden ? 'dev-tool-button dev-tool-button--hidden' : 'dev-tool-button' : 'dev-tool-button--disabled']" @click="hidden =! hidden">{{ hidden ? "show devtool" : "hide devtool" }}</Button>
  </div>
</template>

<style scoped>
.dev-tool-wrapper {
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  top: 50%;
  left: 50%;
  width: 90%;
  height: 90%;
  transform: translate(-50%, -50%);
  transition: all 150ms ease-in-out;
  z-index: 9999;
}

.dev-tool-wrapper--hidden {
  top: 50px;
  transform: translate(-50%, -100%);
  flex-direction: column;
}

.dev-tool-wrapper--disabled {
  display: none;
}

.dev-tool {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 15px;
  color: aliceblue;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.9);
  box-shadow: 0px 0px 10px 1px white;
  overflow: hidden;
  overflow-y: auto;
}

.dev-tool-button {
  margin: auto;
  transform: translateY(50%);
}

.dev-tool-button--hidden {
  transform: translateY(-50%);
}

.dev-tool-button--disabled {
  display: none;
}

.dev-tool--hidden > .dev-tool__button {
  top: 100%;
}
</style>