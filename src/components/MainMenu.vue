<script setup>
  import { inject } from 'vue';
  import Button from './Button.vue';

  const state = inject("state");
  const localization = inject("localization");
</script>

<template>
  <div class="state main-menu">
    <h1>Bubble P⬤pper</h1>
    <Button @click="state.changePageTo('GameField')">{{ localization.menu.start[state.global.localization] }}</Button>
    <Button @click="state.changePageTo('Options')">{{ localization.menu.options[state.global.localization] }}</Button>
    <Button @click="state.changePageTo('Rules')">{{ localization.menu.rules[state.global.localization] }}</Button>
  </div>
</template>

<style scoped>
</style>