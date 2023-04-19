<script setup>
  import { inject, shallowRef, computed } from 'vue';

  import DevTool from './components/DevTool.vue';
  
  import MainMenu from './components/MainMenu.vue';
  import GameField from './components/GameField.vue';
  import Options from './components/Options.vue';
  import Rules from './components/Rules.vue';

  const state = inject("state");

  const pages = shallowRef({
    MainMenu: MainMenu,
    GameField: GameField,
    Options: Options,
    Rules: Rules
  });

  const themeCSS = computed(() => 'theme--' + state.global.theme.toLowerCase());
  
</script>

<template>
  <DevTool
    @click.ctrl.left="state.toggleDevTool"
  />
  <Transition mode="out-in">
    <component
      :is="pages[state.global.currentPage]"
      :class="themeCSS"
      @click.ctrl.left="state.toggleDevTool"
    />
  </Transition>
</template>

<style scoped>

/* THEME SETTINGS */
.theme--dark {
  color: aliceblue;
  background-color: black;
}

.theme--white {
  color: black;
  background-color: aliceblue;
}
/* --- */

.v-enter-active,
.v-leave-active {
  transition: all 300ms ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>