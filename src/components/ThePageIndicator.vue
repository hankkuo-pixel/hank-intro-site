<script setup>
defineProps({
  sections: {
    type: Array,
    required: true,
  },
  currentIndex: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['go-to'])
</script>

<template>
  <aside class="page-indicator mono" aria-label="Page navigation">
    <div class="ticks">
      <button
        v-for="(section, index) in sections"
        :key="section.id"
        type="button"
        class="tick"
        :class="{ active: currentIndex === index }"
        :aria-label="`Go to ${section.id}`"
        @click="emit('go-to', index)"
      />
    </div>
  </aside>
</template>

<style scoped>
.page-indicator {
  position: fixed;
  z-index: 55;
  right: 1.05rem;
  top: 50%;
  transform: translateY(-50%);
  display: block;
  width: 2px;
  height: 7.25rem;
  background: rgba(255, 255, 255, 0.18);
}

.ticks {
  position: absolute;
  inset: 0;
}

.tick {
  position: absolute;
  left: -4px;
  width: 10px;
  height: calc(100% / 9);
  background: transparent;
  transition:
    background var(--dur-hover);
}

.tick:nth-child(1) { top: calc(100% / 9 * 0); }
.tick:nth-child(2) { top: calc(100% / 9 * 1); }
.tick:nth-child(3) { top: calc(100% / 9 * 2); }
.tick:nth-child(4) { top: calc(100% / 9 * 3); }
.tick:nth-child(5) { top: calc(100% / 9 * 4); }
.tick:nth-child(6) { top: calc(100% / 9 * 5); }
.tick:nth-child(7) { top: calc(100% / 9 * 6); }
.tick:nth-child(8) { top: calc(100% / 9 * 7); }
.tick:nth-child(9) { top: calc(100% / 9 * 8); }

.tick.active,
.tick:hover {
  background: #ffffff;
}

@media (max-width: 767px) {
  .page-indicator {
    right: 1rem;
  }
}
</style>
