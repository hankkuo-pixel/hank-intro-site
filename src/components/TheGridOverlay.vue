<script setup>
const verticals = [2.25, 34.05, 65.95, 97.75]
const horizontals = [33.333, 67.78]
</script>

<template>
  <div class="grid-overlay" aria-hidden="true">
    <span
      v-for="left in verticals"
      :key="`v-${left}`"
      class="grid-line grid-line-v"
      :style="{ left: `${left}%` }"
    />
    <span
      v-for="top in horizontals"
      :key="`h-${top}`"
      class="grid-line grid-line-h"
      :style="{ top: `${top}%` }"
    />
    <template v-for="left in verticals" :key="`cross-${left}`">
      <span
        v-for="top in horizontals"
        :key="`${left}-${top}`"
        class="grid-cross"
        :style="{ left: `${left}%`, top: `${top}%` }"
      />
    </template>
  </div>
</template>

<style scoped>
.grid-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  background: var(--line);
}

.grid-line-v {
  top: 0;
  bottom: 0;
  width: 1px;
}

.grid-line-h {
  left: 0;
  right: 0;
  height: 1px;
}

.grid-cross {
  position: absolute;
  width: 9px;
  height: 9px;
  transform: translate(-50%, -50%);
}

.grid-cross::before,
.grid-cross::after {
  content: '';
  position: absolute;
  background: var(--line);
}

.grid-cross::before {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
}

.grid-cross::after {
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
}

@media (max-width: 767px) {
  .grid-line-v:nth-of-type(3),
  .grid-cross {
    display: none;
  }
}
</style>
