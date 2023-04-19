import { ref, readonly, watch, computed, watchEffect } from "vue";

const PAGES_NAMES = {
  MAIN_MENU: "MainMenu",
  GAME_FIELD: "GameField",
  OPTIONS: "Options",
  RULES: "Rules"
};

const DIFFICULTIES_NAMES = {
  EASY: "Easy",
  NORMAL: "Normal",
  HARD: "Hard",
  CUSTOM: "Custom"
};

// Theme define visual representation of:
// App.vue, Bubble.vue, GameInfo.vue, Button.vue
const THEMES = ["Dark", "White"];

const LOCALIZATIONS = ["eng", "ua", "ru"];

const BASIC_VALUES = {
  THEME: THEMES[0],
  INITIAL_MULTIPLIER: 0.5,
  EXHIBITOR_INTENSIVITY: 8,
  BUBBLES_ARRAY: [1],
  BUBBLES_IDS: 1,
  BUBBLES_COUNT: 1,
  TIME_TO_RESUME: 2000,
  INITIAL_COUNTDOWN: 3,
};

const difficulty = ref(localStorage.getItem('difficulty') || DIFFICULTIES_NAMES.NORMAL);

const gameBallance = computed(() => {
  return {
    initialVelocity: difficulty.value === DIFFICULTIES_NAMES.HARD ? 12 :
                     difficulty.value === DIFFICULTIES_NAMES.NORMAL ? 16 :
                     difficulty.value === DIFFICULTIES_NAMES.EASY ? 20 : +localStorage.getItem('initialVelocity') || 20,
    maxVelocity: difficulty.value === DIFFICULTIES_NAMES.HARD ? 8 :
                 difficulty.value === DIFFICULTIES_NAMES.NORMAL ? 10 :
                 difficulty.value === DIFFICULTIES_NAMES.EASY ? 15 : +localStorage.getItem('maxVelocity') || 20,
    pauseBetween: difficulty.value === DIFFICULTIES_NAMES.HARD ? 300 :
                  difficulty.value === DIFFICULTIES_NAMES.NORMAL ? 500 :
                  difficulty.value === DIFFICULTIES_NAMES.EASY ? 800 : +localStorage.getItem('pauseBetween') || 1000,
    minimalPauseBetween: difficulty.value === DIFFICULTIES_NAMES.HARD ? 200 :
                         difficulty.value === DIFFICULTIES_NAMES.NORMAL ? 300 :
                         difficulty.value === DIFFICULTIES_NAMES.EASY ? 500 : +localStorage.getItem('minimalPauseBetween') || 1000,
    bubblesLimit: difficulty.value === DIFFICULTIES_NAMES.HARD ? 6 :
                  difficulty.value === DIFFICULTIES_NAMES.NORMAL ? 4 :
                  difficulty.value === DIFFICULTIES_NAMES.EASY ? 2 :  +localStorage.getItem('bubblesLimit') || 4,
    exhibitorIntensivity: difficulty.value === DIFFICULTIES_NAMES.CUSTOM ? +localStorage.getItem('exhibitorIntensivity') || 8 : 8,
  }
});

const global = ref({
  devTool: false,
  localization: localStorage.getItem('localization') || LOCALIZATIONS[0],
  theme: localStorage.getItem('theme') || BASIC_VALUES.THEME,
  currentPage: PAGES_NAMES.MAIN_MENU,
  gameIniciated: false,
  gameEnded: false,
  gamePaused: false,
  gameResuming: false,
  gameRestarted: false,
  difficulty: difficulty.value,
  randomDifficultyExhibitor: (localStorage.getItem('randomDifficultyExhibitor') === 'true'),
  exhibitorIntensivity: gameBallance.value.exhibitorIntensivity,
  initialVelocity: gameBallance.value.initialVelocity,
  maxVelocity: gameBallance.value.maxVelocity,
  pauseBetween: gameBallance.value.pauseBetween,
  minimalPauseBetween: gameBallance.value.minimalPauseBetween,
  timeToResume: BASIC_VALUES.TIME_TO_RESUME,
  countdownResume: BASIC_VALUES.INITIAL_COUNTDOWN,
  initialMultiplier: BASIC_VALUES.INITIAL_MULTIPLIER,
});

const resumer = ref({
  link: null,
  countdown: null,
});

const bubbles = ref({
  items: [...BASIC_VALUES.BUBBLES_ARRAY],
  IDs: BASIC_VALUES.BUBBLES_IDS,
  count: BASIC_VALUES.BUBBLES_COUNT,
  limit: gameBallance.value.bubblesLimit
});

const toggleDevTool = () => global.value.devTool = !global.value.devTool;

const changeLocalizationTo = (localization) => {
  console.log("Now changing localization to: " + localization);
  
  let localizationCheck = LOCALIZATIONS.indexOf(localization) > -1 ? localization : LOCALIZATIONS[0];
  global.value.localization = localizationCheck;
  
  localStorage.setItem('localization', localizationCheck);
}

const changePageTo = (page) => {
  if (page !== PAGES_NAMES.MAIN_MENU && page !== PAGES_NAMES.GAME_FIELD && page !== PAGES_NAMES.OPTIONS && page !== PAGES_NAMES.RULES) {
    console.log("Provide wrong page! Avalible pages: ", PAGES_NAMES);
    return;
  }

  console.log("Now navigate to: " + page);
  global.value.currentPage = page;
}

const changeThemeTo = (theme) => {
  console.log("Now changing theme to: " + theme);
  
  let themeCheck = THEMES.indexOf(theme) > -1 ? theme : THEMES[0];
  global.value.theme = themeCheck;

  localStorage.setItem('theme', themeCheck);
}

const changeDifficultyTo = (newValue) => {
  console.log("Difficulty changed to: " + newValue);
  difficulty.value = newValue;
  localStorage.setItem('difficulty', newValue);
  if (newValue !== DIFFICULTIES_NAMES.CUSTOM && global.value.randomDifficultyExhibitor) toggleRandomExhibitor(); 
}

const toggleRandomExhibitor = () => {
  console.log("Random Exhibitor changed to: " + !global.value.randomDifficultyExhibitor);
  global.value.randomDifficultyExhibitor = !global.value.randomDifficultyExhibitor;
  localStorage.setItem('randomDifficultyExhibitor', global.value.randomDifficultyExhibitor);
}

const changeExhibitorIntensivity = (newValue) => {
  global.value.exhibitorIntensivity = newValue;
  localStorage.setItem('exhibitorIntensivity', newValue);
}

const customizeDifficulty = (parameter, value, event = null) => {
  value = +value;

  switch (parameter) {
    case "Initial Velocity":
      if (value < 1) value = 1;
      global.value.initialVelocity = value;
      if (value < global.value.maxVelocity) global.value.maxVelocity = value
      break;
    case "Max Velocity":
      if (value < 1) value = 1;
      global.value.maxVelocity = value;
      if (value > global.value.initialVelocity) global.value.initialVelocity = value;
      break;
    case "Pause Between":
      if (value < 0) value = 0;
      global.value.pauseBetween = value;
      if (value < global.value.minimalPauseBetween) global.value.minimalPauseBetween = value;
      break;
    case "Min Pause Between":
      if (value < 0) value = 0;
      global.value.minimalPauseBetween = value;
      if (value > global.value.pauseBetween) global.value.pauseBetween = value;
      break;
    case "Bubble Limit":
      if (value === 2 || value === 4 || value === 6) bubbles.value.limit = value;
      break;
    default:
      console.log('Passed unknown parameter. Use only "Initial Velocity", "Max Velocity", "Pause Between", "Min Pause Between" or "Bubble Limit"');
      return;
  }
}

const iniciateGameStart = () => global.value.gameIniciated = true;
const iniciateGameOver = () => global.value.gameEnded = true;
const iniciateGameRestart = () => global.value.gameRestarted = true;
const toggleGameResume = () => global.value.gameResuming = !global.value.gameResuming;
const toggleGamePause = () => global.value.gamePaused = !global.value.gamePaused;

const generateBubble = (amount = 1) => {
  if (bubbles.value.count === bubbles.value.limit) return;

  for (let i = 0; i < amount; i++) {
    console.log("Generating new bubble.");
    
    bubbles.value.IDs = bubbles.value.IDs + 1;
    bubbles.value.items.push(bubbles.value.IDs);
    bubbles.value.count = bubbles.value.count + 1;

    if (bubbles.value.count === gameBallance.value.bubblesLimit) return;
  }
}

const removeBubble = (id) => {
  
  switch (id === "all") {
    case true:
      console.log("Removing all bubbles.");
      bubbles.value.items.splice(0, bubbles.value.items.length);
      bubbles.value.count = 0;
      break;
    default:
      console.log("Removing bubble: " + id + ".");
      bubbles.value.items.splice(bubbles.value.items.indexOf(id), 1);
      bubbles.value.count = bubbles.value.count - 1;
  }

}

// Reset ingame states to default:
// - switch game values to oroginal state;
// - clear resume timers;
// - reset bubbles state.
function resetState() {
  global.value.gameIniciated = false;
  global.value.gameEnded = false;
  global.value.gamePaused = false;
  global.value.gameResuming = false;
  global.value.countdownResume = BASIC_VALUES.INITIAL_COUNTDOWN;

  clearTimeout(resumer.value.link);
  clearInterval(resumer.value.countdown);

  resumer.value.link = null;
  resumer.value.countdown = null;
  
  bubbles.value.items = [...BASIC_VALUES.BUBBLES_ARRAY];
  bubbles.value.IDs = BASIC_VALUES.BUBBLES_IDS;
  bubbles.value.count = BASIC_VALUES.BUBBLES_COUNT;

  global.value.gameRestarted = false;
}

// Trigers update inside "global" and "bubbles"...
// ... when player change difficulty.
watch(difficulty, () => {
  global.value.difficulty = difficulty.value,
  global.value.initialVelocity = gameBallance.value.initialVelocity;
  global.value.maxVelocity = gameBallance.value.maxVelocity;
  global.value.pauseBetween = gameBallance.value.pauseBetween;
  global.value.minimalPauseBetween = gameBallance.value.minimalPauseBetween;
  global.value.exhibitorIntensivity = gameBallance.value.exhibitorIntensivity;
  bubbles.value.limit = gameBallance.value.bubblesLimit;
});

// Put value of Initial Velocity inside Local Storage...
// ... only at "Custom" difficulty
watch(() => global.value.initialVelocity, () => {
  if (global.value.difficulty !== DIFFICULTIES_NAMES.CUSTOM) return;
  localStorage.setItem('initialVelocity', global.value.initialVelocity);
});

// Put value of Max Velocity inside Local Storage...
// ... only at "Custom" difficulty
watch(() => global.value.maxVelocity, () => {
  if (global.value.difficulty !== DIFFICULTIES_NAMES.CUSTOM) return;
  localStorage.setItem('maxVelocity', global.value.maxVelocity);
});

// Put value of Initial Pause Between "ticks" inside Local Storage...
// ... only at "Custom" difficulty
watch(() => global.value.pauseBetween, () => {
  if (global.value.difficulty !== DIFFICULTIES_NAMES.CUSTOM) return;
  localStorage.setItem('pauseBetween', global.value.pauseBetween);
});

// Put value of Minimal Pause Between "ticks" inside Local Storage...
// ... only at "Custom" difficulty
watch(() => global.value.minimalPauseBetween, () => {
  if (global.value.difficulty !== DIFFICULTIES_NAMES.CUSTOM) return;
  localStorage.setItem('minimalPauseBetween', global.value.minimalPauseBetween);
});

// Put value of Bubble Limit inside Local Storage...
// ... only at "Custom" difficulty
watch(() => bubbles.value.limit, () => {
  if (global.value.difficulty !== DIFFICULTIES_NAMES.CUSTOM) return;
  localStorage.setItem('bubblesLimit', bubbles.value.limit);
});

// Game Over:
// - remove all bubbles 
// - generate two bubbles: "Restart" and "Back to Menu" (check GameField.vue -> onAfterBubbleLeave function)
watch(() => global.value.gameEnded, () => {
  if (!global.value.gameEnded) return;
  
  console.log("Iniciate: Game Over");
  
  removeBubble("all");
  global.value.gameIniciated = false;
});

// Game Restarted:
// - remove all bubbles 
// - all values switched to default (check GameField.vue -> onAfterBubbleLeave function)
watch(() => global.value.gameRestarted, () => {
  if (!global.value.gameRestarted) return;

  console.log("Iniciate: Game Restart");
  
  removeBubble("all");
});

// Game Paused:
// - toggle resuming state, if game inside resuming process
// - toggle resuming state, if game iniciated
watch(() => global.value.gamePaused, () => {

  switch (global.value.gamePaused) {
    case true:
      console.log("Iniciate: Game Pause");
      if (global.value.gameResuming) toggleGameResume();
      break;
    default:
      if (global.value.gameIniciated) toggleGameResume();
      return;
  }
  
});

// Game Resuming after being paused:
// - takes out of pause state;
// - prevents returning to game, if user iniciate pause before countdown ends.
watch(() => global.value.gameResuming, () => {

  switch (global.value.gameResuming) {
    case true:
      console.log("Iniciate: Game Resume");

      resumer.value.link = setTimeout(toggleGameResume, global.value.timeToResume);
      
      resumer.value.countdown = setInterval(() => {
        global.value.countdownResume = global.value.countdownResume - 1;
      }, global.value.timeToResume / BASIC_VALUES.INITIAL_COUNTDOWN);

      break;
    default:
      console.log("Iniciate: Prevent Game Resume");
      
      clearTimeout(resumer.value.link);
      clearInterval(resumer.value.countdown);
      
      global.value.countdownResume = BASIC_VALUES.INITIAL_COUNTDOWN;
  }
});

// All bubbles destroyed by player:
// - generate new bubble to continue game
watch(() => bubbles.value.items[bubbles.value.items.length - 1], () => {
  if (bubbles.value.items.length === 0 && !global.value.gameEnded && !global.value.gameRestarted) generateBubble();
});

// Reset ingame state, when user navigates to Main Menu
watch(() => global.value.currentPage, resetState);

// Change background color of <html> and <body>...
// ... to fit current theme.
watchEffect(() => {
  switch (global.value.theme) {
    case "Dark":
      changeDocumentColor("black");
      break;
    case "White":
      changeDocumentColor("aliceblue");
      break;
  }

  function changeDocumentColor(color) {
    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
  }
});

export default {
  global: readonly(global.value),
  bubbles: readonly(bubbles.value),
  toggleDevTool,
  changePageTo,
  changeLocalizationTo,
  changeThemeTo,
  changeDifficultyTo,
  toggleRandomExhibitor,
  changeExhibitorIntensivity,
  customizeDifficulty,
  iniciateGameStart,
  iniciateGameOver,
  iniciateGameRestart,
  toggleGameResume,
  toggleGamePause,
  generateBubble,
  removeBubble,
  resetState
}