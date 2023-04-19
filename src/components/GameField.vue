<script setup>
  import { ref, computed, inject, watch } from 'vue';
  import GameInfo from './GameInfo.vue';
  import Bubble from './Bubble.vue';

  const state = inject("state");

  const multiplier = computed(() => { return state.global.initialMultiplier * state.bubbles.count });
  const condition = ref({ x: 0, y: 0, scale: 1.00, scale_css: 1.00 });
  const score = ref(0);

  function copyConditionFrom(source, lazy = false) {
    const transformMatrix = getComputedStyle(source).transform.slice(7, -1).split(", ");
    
    switch (lazy) {
      case true:
        return { x: +transformMatrix[4], y: +transformMatrix[5], scale_css: +transformMatrix[0] };
      default:
        condition.value.x = +transformMatrix[4];
        condition.value.y = +transformMatrix[5];
        condition.value.scale_css = +transformMatrix[0];
    }
  }

  function copyScale(newValue) {
    condition.value.scale = +newValue.toFixed(2);
  }

  function resetCondition() {
    condition.value = {x: 0, y: 0, scale: 1.00, scale_css: 1.00};
  }

  function increaseScore() {
    score.value = score.value + 1;
  }

  function resetScore() {
    score.value = 0;
  }

  function onBubbleCreate(elem) {
    if (state.bubbles.count > 1) return;
    elem.style.transform = "translate(0, 0) scale(0)";
    setTimeout(() => elem.style.transform = "translate(0, 0) scale(1)", 0);
  }

  function onBubbleRemove(elem) {
    const currentCondition = copyConditionFrom(elem, true);
    
    elem.style.transform = `translate(${currentCondition.x}px, ${currentCondition.y}px) scale(${currentCondition.scale_css * 2}, 0)`;
    elem.style.transitionDuration = "100ms";
    elem.style.transitionTimingFunction = "easy-in-out";
  }

  function onAfterBubbleLeave(elem) {

    switch (true) {
      case state.global.gameRestarted:
        state.resetState();
        return;
      case state.global.gameEnded && state.bubbles.count === 0:
        state.generateBubble(2);
        return;
    }

  }

  // Reset bubble condition, when game ends
  watch(() => state.global.gameEnded, () => {
    if (state.global.gameEnded) resetCondition();
  });

  // Reset bubble condition, when game paused
  watch(() => state.global.gamePaused, () => {
    if (state.global.gamePaused) resetCondition();
  });

  // Reset bubble condition, when no bubble left on a game field
  watch(() => state.bubbles.items[state.bubbles.items.length - 1], () => {
    if (state.bubbles.items.length === 0) resetCondition();
  });

  // Reset score on game restart
  watch(() => state.global.gameRestarted, () => {
    if (state.global.gameRestarted) resetScore();
  });

</script>

<template>
  <div class="field">
    <GameInfo
      :multiplier="multiplier"
      :score="score"
      :condition="condition"
    />
    <TransitionGroup
      @enter="onBubbleCreate"
      @leave="onBubbleRemove"
      @after-leave="onAfterBubbleLeave"
    >
      <Bubble
        v-for="(bubble, index) in state.bubbles.items"
        :key="bubble"
        :id="bubble"
        :index="index"
        :isOriginal="index === 0 ? true : false"
        :multiplier="multiplier"
        :condition="condition"
        :score="score"
        @copyConditionFrom="copyConditionFrom"
        @copyScale="copyScale"
        @increaseScore="increaseScore"
        @click="state.iniciateGameStart"
      />
    </TransitionGroup>
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