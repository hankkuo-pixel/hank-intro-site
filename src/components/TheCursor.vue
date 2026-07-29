<script setup>
import { computed } from 'vue'
import { useCursor } from '@/composables/useCursor'

const { position, target, isInteractive, isTouch } = useCursor()

const cursorStyle = computed(() => ({
  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isInteractive.value ? 1.15 : 1})`,
}))

const coordinateStyle = computed(() => ({
  '--cursor-x': Math.round(target.x),
  '--cursor-y': Math.round(target.y),
}))
</script>

<template>
  <div v-if="!isTouch" class="cursor-layer" :style="coordinateStyle" aria-hidden="true">
    <img class="cursor-arrow" :style="cursorStyle" :src="'./images/cursor-arrow.png'" alt="" />
  </div>
</template>

<style scoped>
.cursor-layer {
  position: fixed;
  inset: 0;
  z-index: 80;
  pointer-events: none;
}

.cursor-arrow {
  position: absolute;
  left: -10px;
  top: -8px;
  width: 42px;
  height: 42px;
  object-fit: contain;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.4));
  transition: transform 120ms ease;
  will-change: transform;
}
</style>
