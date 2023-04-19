<script setup>
  import { ref, computed, onMounted, watch, watchPostEffect, onUnmounted, inject } from 'vue';

  const state = inject("state");

  const props = defineProps(["id", "bubbles", "isOriginal", "gameIniciated", "transform", "score", "multiplier", "gameEnded"]);
  const emit = defineEmits(["copyPositionFrom", "copyScale", "remove", "iniciateGameOver", "restartGame"]);
  
  const elem = ref(null);
  const position = ref({ x: props.transform.x, y: props.transform.y });
  const scale = ref(props.transform.scale);
  const scaleCSS = ref(props.transform.scale);
  const decreaser = ref({ link: null, active: false, params: null });
  const increaser = ref({ link: null,  active: false, params: null });
  const bubbleStyle = computed(() => {
    return decreaser.value.active ? "bubble bubble--down" :
           increaser.value.active ? "bubble bubble--up" : "bubble";
  });
  const velocity = computed(() => props.score >= (state.global.initialVelocity - state.global.maxVelocity) ? state.global.maxVelocity : state.global.initialVelocity - props.score);
  
  function handleClick(e) {
    
    switch (true) {
      case props.gameEnded && props.isOriginal:
        emit("restartGame");
        return;
      case props.gameEnded && !props.isOriginal:
        state.changePageTo("MainMenu");
        return;
      case !props.gameEnded:
        cleanUp();
        emit("copyPositionFrom", elem.value);
        emit("copyScale", scale.value);
        runDecreaser(props.multiplier, velocity.value);
        setRandomPosition();
        return;
    }

  }

  function runDecreaser(value, velocity) {
    increaser.value.active = false;
    decreaser.value.active = true;

    const goal = +scale.value.toFixed(2) - value;
    const scalesPerTick = 0.01;
    
    setScaleCSS(goal, ((+scale.value.toFixed(2) - goal) / scalesPerTick * velocity));

    decreaser.value.link = setInterval(() => {
      decreaseBubble(scalesPerTick);
      const progress = +(goal - scale.value).toFixed(2);

      switch (true) {
        case (goal < 0 && scale.value === 0):
          cleanUp();
          emit("iniciateGameOver");
          return;
        case (progress === 0 && goal === 0):
          clearInterval(decreaser.value.link);
          emit("remove", props.id);
          return;
        case (progress === 0 && goal > 0):
          clearInterval(decreaser.value.link);
          runIncreaser(scalesPerTick, velocity, 400);
          return;
      }
    }, velocity);
  }

  function runIncreaser(value, velocity, delayInMs = 0) {
    decreaser.value.active = false;
    increaser.value.params = arguments;
    clearTimeout(increaser.value.link);
    
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

  function pauseIncreaserFor(durationInMs) {
    clearInterval(increaser.value.link);
    setScaleCSS(0, 9999);
    runIncreaser(increaser.value.params[0], increaser.value.params[1], durationInMs);
  }

  function cleanUp() {
    clearTimeout(increaser.value.link);
    clearInterval(decreaser.value.link);
    clearInterval(increaser.value.link);
  }

  function setScaleCSS(newValue, transitionDuration) {
    setTranition("transform", transitionDuration);
    scaleCSS.value = newValue > 2 ? 2 : newValue < 0.4 ? 0.4 : newValue;
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
    if (decreaser.value.active) return;
    
    let stopPoint = +scale.value.toFixed(2) - Math.floor(scale.value);
    
    if (stopPoint === 0 || stopPoint === 0.5 || stopPoint === 1) pauseIncreaserFor(1000);
  });

  watchPostEffect(() => {
    elem.value.style.transform = `translate(${position.value.x}px, ${position.value.y}px) scale(${scaleCSS.value})`;
  })

  onMounted(() => {
    switch (true) {
      case (props.isOriginal && !props.gameIniciated):
        return;
      case (props.isOriginal && props.gameIniciated && !props.gameEnded):
        runIncreaser(0.01, velocity.value, 800);
        return;
      case (props.gameEnded):
        setRandomPosition();
        return;
      default:
        runDecreaser(props.multiplier - state.global.initialMultiplier, velocity.value);
        setRandomPosition();
    }
  });

  onUnmounted(cleanUp);
</script>

<template>
  <Transition>
    <div
      :class="bubbleStyle"
      :style="{ transform: `translate(${position.x}px, ${position.y}px) scale(${scaleCSS})` }"
      ref="elem"
      @click="handleClick"
    >
      <span v-if="!props.gameEnded" class="bubble__scale">{{ scale.toFixed(2) }}</span>
      <span v-else class="bubble__scale">
        <span v-if="props.isOriginal" class="material-symbols-outlined" style="font-size: 80px; margin-top: 20px;">refresh</span>
        <span v-else class="material-symbols-outlined" style="font-size: 80px; margin-top: 20px; margin-left: 15px;">logout</span>
      </span>
      <!-- <span class="bubble__id">{{ props.id }}</span> -->
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
  font-size: 55px;
  border: 2px solid black;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 50%;
  box-shadow: 0px 0px 5px 2px black;
  cursor: pointer;
  transition-property: opacity, transform, box-shadow, border;
  transition-duration: 100ms, 600ms, 300ms, 300ms;
  transition-timing-function: ease, ease, ease-in-out, ease-in-out;
  overflow: hidden;
  /* transition: transform 600ms ease-out,
              box-shadow 300ms ease-out,
              border 300ms ease-out; */
}

.bubble--up {
  border: 2px solid green;
  box-shadow: 0px 0px 5px 2px green;
}

.bubble--down {
  border: 2px solid red;
  box-shadow: 0px 0px 5px 2px red;
}

.bubble__scale {
  z-index: 1;
  color: black;
  text-shadow: 0px 0px 1px black;
  transition: color 2s ease-in-out;
}

.bubble--up .bubble__scale {
  color: black;
}

.bubble--down .bubble__scale {
  color: black;
}

.bubble__id {
  position: absolute;
  top: 50%;
  left: 50%;
  color: rgba(0, 0, 0, 0.2);
  font-size: 100px;
  transform: translate(-50%, -50%);
  z-index: 0;
}

/* .v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
} */
</style>