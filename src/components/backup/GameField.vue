<script setup>
  import { ref, computed, watchEffect, inject } from 'vue';
  import GameInfo from './GameInfo.vue';
  import Bubble from './Bubble.vue';

  const state = inject("state");

  const gameIniciated = ref(false);
  const gameEnded = ref(false);
  const bubbles = ref([1]);
  const bubblesIDs = ref(1);
  const bubblesCollection = ref(1);
  const multiplierValue = computed(() => { return state.global.initialMultiplier * bubblesCollection.value });
  const transform = ref({ x: 0, y: 0, scale: 1.00 });
  const score = ref(0);

  function copyPositionFrom(source, lazy = false) {
    const transformMatrix = getComputedStyle(source).transform.slice(7, -1).split(", ");
    
    switch (lazy) {
      case true:
        return { x: +transformMatrix[4], y: +transformMatrix[5] };
      default:
        transform.value.x = +transformMatrix[4];
        transform.value.y = +transformMatrix[5];
    }
  }

  function copyScale(newValue) {
    transform.value.scale = +newValue.toFixed(2);
  }

  function removeBubble(id) {
    
    switch (id === "all") {
      case true:
        bubbles.value.splice(0, bubbles.value.length);
        bubblesCollection.value = 0;
        break;
      default:
        bubbles.value.splice(bubbles.value.indexOf(id), 1);
        bubblesCollection.value = bubblesCollection.value - 1;
        score.value = score.value + 1;
    }
    
  }
  
  function generateBubble() {
    if (bubblesCollection.value === 4) return;
    
    bubblesIDs.value = bubblesIDs.value + 1;
    bubbles.value.push(bubblesIDs.value);
    bubblesCollection.value = bubblesCollection.value + 1;
  }

  function resetTransform() {
    transform.value = {x: 0, y: 0, scale: 1.00};
  }

  function iniciateGameOver() {
    gameEnded.value = true;
    removeBubble("all");
    setTimeout(() => {
      resetTransform();
      generateBubble();
      generateBubble();
    }, 400);
  }

  function restartGame() {
    removeBubble("all");
    gameIniciated.value = false;
    gameEnded.value = false;
    score.value = 0;
  }

  function handleClick() {
    if (gameEnded.value) return;
    if (!gameIniciated.value) gameIniciated.value = true;
    generateBubble();
  }

  function onBubbleCreate(elem) {
    if (bubblesCollection.value > 1) return;
    elem.style.transform = "translate(0, 0) scale(0)";
    setTimeout(() => elem.style.transform = "translate(0, 0) scale(1)", 0);
  }

  function onBubbleRemove(elem) {
    const currentPosition = copyPositionFrom(elem, true);
    
    elem.style.transform = `translate(${currentPosition.x}px, ${currentPosition.y}px) scale(1, 0)`;
    elem.style.transitionDuration = "100ms";
    elem.style.transitionTimingFunction = "easy-in-out";
  }

  watchEffect(() => {
    if (!gameIniciated.value) return;
    if (bubblesCollection.value > 0) return;
    if (gameEnded.value) return;
    generateBubble();
    resetTransform();
  });
</script>

<template>
  <div class="field">
    <GameInfo
      :gameEnded="gameEnded"
      :multiplier="multiplierValue"
      :score="score"
    />
    <TransitionGroup
      @enter="onBubbleCreate"
      @leave="onBubbleRemove"
    >
      <Bubble
        v-for="(bubble, index) in bubbles"
        :key="bubble"
        :id="bubble"
        :bubbles="bubbles"
        :gameIniciated="gameIniciated"
        :gameEnded="gameEnded"
        :isOriginal="index === 0 ? true : false"
        :multiplier="multiplierValue"
        :transform="transform"
        :score="score"
        @copyPositionFrom="copyPositionFrom"
        @copyScale="copyScale"
        @remove="removeBubble"
        @iniciateGameOver="iniciateGameOver"
        @restartGame="restartGame"
        @click="handleClick"
      />
    </TransitionGroup>
    <!-- <GameOver
      @changeStateTo="emits.changeStateTo"
    /> -->
  </div>
</template>

<style scoped>
.field {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>