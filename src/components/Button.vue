<script setup>
  import { inject, computed } from 'vue';

  const props = defineProps("disabled");

  const state = inject("state");
  const localization = inject("localization");
  
  const isDisabled = computed(() => props.disabled === undefined ? false : props.disabled);
  const themeCSS = computed(() => 'button--theme-' + state.global.theme.toLowerCase());

</script>

<template>
  <button :class="themeCSS" :style="{ fontFamily: localization.fonts[state.global.localization]}" :disabled="isDisabled"><slot>Nameless button</slot></button>
</template>

<style scoped>
button {
  position: relative;
  margin: 10px;
  padding: 4px 10px 0px 10px;
  font-size: 25px;
  border: medium none;
  border-radius: 10px;
  transition: all 300ms ease-in-out;
  cursor: pointer;
}

button::before,
button::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  width: 0%;
  height: 1px;
  transform: translateY(-100%);
  transform-origin: center right;
  transition: all 100ms ease-in-out;
}

button::after {
  transform: translateY(-100%) rotate(180deg);
  transform-origin: center left;
}

button:hover:not(button:disabled)::before,
button:hover:not(button:disabled)::after {
  width: 50%;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--theme-dark {
  color: aliceblue;
  background-color: black;
  text-shadow: 0px 0px 0px aliceblue;
}

.button--theme-dark:hover:not(button:disabled) {
  text-shadow: 0px 0px 12px aliceblue;
}

.button--theme-dark::before,
.button--theme-dark::after {
  background: rgb(255,255,255);
  background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 100%);
}

.button--theme-white {
  color: black;
  background-color: aliceblue;
  text-shadow: 0px 0px 0px black;
}

.button--theme-white:hover:not(button:disabled) {
  text-shadow: 0px 0px 1px black;
}

.button--theme-white::before,
.button--theme-white::after {
  background: rgb(0, 0, 0);
  background: linear-gradient(90deg, rgb(0, 0, 0) 0%, rgba(0,0,0,0) 100%);
}
</style>