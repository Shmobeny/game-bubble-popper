<script setup>
  import { ref, computed, onMounted, watch, watchPostEffect, onUnmounted, inject } from 'vue';

  const state = inject("state");

  const props = defineProps(["id", "index", "isOriginal", "multiplier", "condition", "score"]);
  const emit = defineEmits(["copyConditionFrom", "copyScale", "increaseScore"]);

  const decreaser = ref({ link: null, active: false, params: [] });
  const increaser = ref({ link: null,  active: false, params: [] });
  const velocity = computed(calcVelocity);
  const pauseInIncrease = computed(calcPause);

  const elem = ref(null);
  const position = ref({ x: props.condition.x, y: props.condition.y });
  const scale = ref(props.condition.scale);
  const scale_css = ref(props.condition.scale_css);
  const style = computed(() => decreaser.value.active === true && !state.global.gamePaused ? "bubble bubble--down" :
                               increaser.value.active === true && !state.global.gamePaused ? "bubble bubble--up" : "bubble");
  const themeCSS = computed(() => 'bubble--theme-' + state.global.theme.toLowerCase());

  function calcVelocity() {
    switch (state.global.randomDifficultyExhibitor) {
      case true:
        return getRandom(state.global.maxVelocity, state.global.initialVelocity);
      default:
        return props.score >= ((state.global.initialVelocity - state.global.maxVelocity) * state.global.exhibitorIntensivity) ? state.global.maxVelocity : state.global.initialVelocity - (props.score / state.global.exhibitorIntensivity);
    }
  }

  function calcPause() {
    switch (state.global.randomDifficultyExhibitor) {
      case true:
        return getRandom(state.global.minimalPauseBetween, state.global.pauseBetween);
      default:
        return props.score >= ((state.global.pauseBetween - state.global.minimalPauseBetween) / state.global.exhibitorIntensivity) ? state.global.minimalPauseBetween : state.global.pauseBetween - props.score * state.global.exhibitorIntensivity;
    }
  }
  
  function handleClick(e) {
    
    switch (true) {
      case (state.global.gameEnded || state.global.gamePaused) && props.isOriginal:
        state.iniciateGameRestart();
        break;
      case (state.global.gameEnded || state.global.gamePaused) && !props.isOriginal:
        state.changePageTo("MainMenu");
        break;
      case !state.global.gameEnded && !state.global.gameIniciated:
        state.iniciateGameStart();
        break;
      case !state.global.gameEnded && !state.global.gameResuming && state.global.gameIniciated:
        action();
        break;
      default:
        return;
    }

  }

  function action() {
    cleanUp();
    emit("copyConditionFrom", elem.value);
    emit("copyScale", scale.value);
    state.generateBubble();
    runDecreaser(props.multiplier, velocity.value);
    setRandomPosition();
  }

  function runDecreaser(value, velocity) {
    increaser.value.active = false;
    decreaser.value.active = true;
    
    const scalesPerTick = 0.01;
    const goal = +scale.value.toFixed(2) - value;
    
    decreaser.value.params.splice(0);
    decreaser.value.params.push(velocity);
    decreaser.value.params.push(goal);
    
    setScaleCSS(goal, ((+scale.value.toFixed(2) - goal) / scalesPerTick * velocity));

    decreaser.value.link = setInterval(() => {
      decreaseBubble(scalesPerTick);
      const progress = +(goal - scale.value).toFixed(2);

      switch (true) {
        // case (goal < 0 && scale.value === 0):
        //   cleanUp();
        //   state.iniciateGameOver();
        //   return;
        case (progress === 0 && goal === 0):
          cleanUp();
          state.removeBubble(props.id);
          emit("increaseScore");
          return;
        case (progress === 0 && goal > 0):
          clearInterval(decreaser.value.link);
          runIncreaser(scalesPerTick, velocity, 400);
          return;
      }
    }, velocity);
  }

  function runIncreaser(value, velocity, delayInMs = 0) {
    clearTimeout(increaser.value.link);
    
    decreaser.value.active = false;
    increaser.value.active = "delayed";
    
    increaser.value.params.splice(0); 
    increaser.value.params = [...arguments];
    
    increaser.value.link = setTimeout(() => {
      increaser.value.active = true;
      setScaleCSS(2, (2 / value * velocity));
      increaser.value.link = setInterval(() => increaseBubble(value), velocity);
    }, delayInMs);
  }

  function decreaseBubble(value) {
    scale.value = +(scale.value - value).toFixed(2);
  }

  function increaseBubble(value) {
    scale.value = +(scale.value + value).toFixed(2);
  }
  
  function setRandomPosition() {
    const container = document.querySelector("#app");
    position.value.x = getRandom(elem.value.offsetLeft * -1, container.clientWidth - elem.value.offsetLeft - elem.value.offsetWidth);
    position.value.y = getRandom(elem.value.offsetTop * -1, container.clientHeight - elem.value.offsetTop - elem.value.offsetHeight);
  }

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pauseBubbleFor(durationInMs) {

    switch (true) {
      case decreaser.value.active === true || decreaser.value.active === "delayed":
        if (decreaser.value.active === "delayed") {
          clearTimeout(decreaser.value.link);
        } else {
          clearInterval(decreaser.value.link);
        }

        if (durationInMs === "ever") {
          props.index < 2 ? setScaleCSS(1, 1000) : setScaleCSS(0, 1000, true);
          return;
        } else {
          setScaleCSS(0, 999999999999);
          runDecreaser(decreaser.value.params[0], decreaser.value.params[1]);
        }

        break;
      case increaser.value.active === true || increaser.value.active === "delayed":
        if (increaser.value.active === "delayed") {
          clearTimeout(increaser.value.link);
        } else {
          clearInterval(increaser.value.link);
        }
        
        if (durationInMs === "ever") {
          props.index < 2 ? setScaleCSS(1, 1000) : setScaleCSS(0, 1000, true);
          return;
        } else {
          setScaleCSS(0, 999999999999);
          runIncreaser(increaser.value.params[0], increaser.value.params[1], durationInMs);
        }

        break;
    }
  }

  function resumeBubble(delayInMs = 0) {
    
    setScaleCSS(scale.value, 400);
    
    switch (true) {
      case decreaser.value.active === true || decreaser.value.active === "delayed":
        decreaser.value.active = "delayed";
        clearTimeout(decreaser.value.link);
        
        decreaser.value.link = setTimeout(() => {
          runDecreaser(+(scale.value - decreaser.value.params[1]).toFixed(2), decreaser.value.params[0]);
        }, delayInMs);

        break;
      case increaser.value.active === true || increaser.value.active === "delayed":
        runIncreaser(increaser.value.params[0], increaser.value.params[1], delayInMs);
        break;
    }

  }

  function cleanUp() {
    clearTimeout(increaser.value.link);
    clearTimeout(decreaser.value.link);
    clearInterval(increaser.value.link);
    clearInterval(decreaser.value.link);
  }

  function setScaleCSS(newValue, transitionDuration, limited = false) {
    setTranition("transform", transitionDuration);
    
    switch (limited) {
      case false:
        scale_css.value = newValue > 2 ? 2 : newValue < 0.4 ? 0.4 : newValue;
        break;
      default:
        scale_css.value = newValue > 2 ? 2 : newValue < 0 ? 0 : newValue;
    }
  }

  function setTranition(property, newValue) {
    const transition = getTransition();
    
    const indexOfProperty = transition.property.indexOf(property);
    transition.duration.splice(indexOfProperty, 1, newValue + "ms");
    elem.value.style.transitionDuration = transition.duration;

    function getTransition() {
      const computedStyle = getComputedStyle(elem.value);

      return {
        duration: computedStyle.transitionDuration.split(", "),
        property: computedStyle.transitionProperty.split(", "),
        timingFunction: computedStyle.transitionTimingFunction.split(", ")
      };
    }
  }

  watch(scale, () => {

    switch (scale.value > 3 || scale.value < 0) {
      case true:
        cleanUp();
        state.iniciateGameOver();
        break;
      default:
        if (decreaser.value.active) return;
        let stopPoint = +scale.value.toFixed(2) - Math.floor(scale.value);
        if (stopPoint === 0 || stopPoint === 0.5 || stopPoint === 1) pauseBubbleFor(pauseInIncrease.value);
    }

  });

  watch(() => state.global.gameIniciated, () => {
    if (state.global.gameIniciated && !state.global.gameEnded) action();
  });

  watch(() => state.global.gamePaused, () => {

    switch (state.global.gamePaused) {
      case true:
        pauseBubbleFor("ever");
        if (state.bubbles.count < 2) state.generateBubble();
        break;
      default:
        if (increaser.value.link || decreaser.value.link) {
          resumeBubble(state.global.timeToResume);
        } else {
          state.removeBubble(props.id);
        } 
    }

  });

  watchPostEffect(() => {
    elem.value.style.transform = `translate(${position.value.x}px, ${position.value.y}px) scale(${scale_css.value})`;
  })

  onMounted(() => {
    
    switch (true) {
      case (!props.isOriginal && state.global.gameIniciated && !state.global.gameEnded && !state.global.gamePaused):
        runDecreaser(props.multiplier - state.global.initialMultiplier, velocity.value);
        setRandomPosition();
        break;
      case (props.isOriginal && state.global.gameIniciated && !state.global.gameEnded):
        runIncreaser(0.01, velocity.value, 800);
        break;
      case (state.global.gameEnded || state.global.gamePaused):
        setRandomPosition();
        break;
      default:
        return;
    }

  });

  onUnmounted(cleanUp);
</script>

<template>
  <Transition>
    <div
      :class="style + ' ' + themeCSS"
      :style="{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale_css})` }"
      ref="elem"
      @click="handleClick"
    >

      <Transition name="in-bubble" mode="out-in">
        <span v-if="state.global.gamePaused || state.global.gameEnded" class="bubble__scale">
          <span v-if="props.isOriginal" class="material-symbols-outlined" style="font-size: 80px; margin-top: 20px;">refresh</span>
          <span v-else-if="!props.isOriginal && props.index < 2" class="material-symbols-outlined" style="font-size: 80px; margin-top: 20px; margin-left: 15px;">logout</span>
        </span>

        <span v-else class="bubble__scale">{{ scale.toFixed(2) }}</span>
      </Transition>

      <span v-if="state.global.devTool" class="bubble__id">{{ props.id }}</span>
      <span v-if="state.global.devTool" class="bubble__velocity">{{ velocity }}</span>
      <span v-if="state.global.devTool" class="bubble__pause">{{ pauseInIncrease }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.wrapper {
  width: 104px;
  height: 104px;
}

.bubble {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  font-family: 'Bebas Neue', cursive;
  font-size: 55px;
  border-radius: 50%;
  cursor: pointer;
  transition-property: opacity, transform, box-shadow, border;
  transition-duration: 100ms, 600ms, 300ms, 300ms;
  transition-timing-function: ease, ease, ease-in-out, ease-in-out;
}

/* THEMES SETTINGS */
.bubble--theme-dark {
  color: black;
  border: 2px solid black;
  background-color: aliceblue;
  box-shadow: 0px 0px 5px 2px black;
}

.bubble--theme-white {
  color: aliceblue;
  border: 2px solid black;
  background-color: black;
  box-shadow: 0px 0px 5px 2px black;
}

.bubble--theme-dark.bubble--up {
  border: 2px solid green;
  box-shadow: 0px 0px 5px 2px green;
}

.bubble--theme-dark.bubble--down {
  border: 2px solid red;
  box-shadow: 0px 0px 5px 2px red;
}

.bubble--theme-white.bubble--up {
  border: 2px solid rgba(0, 225, 255, 1);
  box-shadow: 0px 0px 5px 2px rgba(0, 225, 255, 0.5);
}

.bubble--theme-white.bubble--down {
  border: 2px solid rgba(247, 0, 255, 1);
  box-shadow: 0px 0px 5px 2px rgba(247, 0, 255, 0.5);
}

.bubble--theme-dark > .bubble__scale {
  color: black;
  text-shadow: 0px 0px 1px black;
}

.bubble--theme-white > .bubble__scale {
  color: white;
  text-shadow: 0px 0px 1px aliceblue;
}
/* --- */

.bubble__scale {
  z-index: 1;
}

.bubble__id {
  position: absolute;
  top: 50%;
  left: 50%;
  color: rgba(0, 0, 0, 0.4);
  font-size: 80px;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.bubble__velocity {
  position: absolute;
  top: 0%;
  left: 0%;
  color: rgb(43, 255, 0);
  font-size: 30px;
  transform: translate(-100%, -100%);
  z-index: 0;
}

.bubble__pause {
  position: absolute;
  top: 100%;
  left: 100%;
  color: rgb(4, 0, 255);
  font-size: 30px;
  z-index: 0;
}

.in-bubble-enter-active,
.in-bubble-leave-active {
  transition: transform 0.1s ease-in-out;
}

.in-bubble-enter-from,
.in-bubble-leave-to {
  transform: scale(0);
}

</style>